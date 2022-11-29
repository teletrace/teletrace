package tracewriter

import (
	"crypto/md5"
	"database/sql"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/repository"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
	"sort"
)

type TraceWriter interface {
	WriteTraces(traces ptrace.Traces) error
	CloseDB() error
}

func NewTraceWriter(logger *zap.Logger, db *sql.DB) TraceWriter {
	return &traceWriter{
		logger: logger,
		db:     db,
	}
}

func (tw *traceWriter) CloseDB() error {
	return tw.db.Close()
}

type traceWriter struct {
	logger *zap.Logger
	db     *sql.DB
}

func (tw *traceWriter) WriteTraces(traces ptrace.Traces) error {
	tx, err := tw.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %+v\n", err)
	}

	resourceSpansSlice := traces.ResourceSpans()
	for i := 0; i < resourceSpansSlice.Len(); i++ {
		resourceSpans := resourceSpansSlice.At(i)
		resourceAttributes := resourceSpans.Resource().Attributes()
		resourceId, err := hashAttributes(resourceAttributes) // Generating a resource identifier to store with each span
		if err != nil || resourceId == "" {
			tw.logger.Error("failed to hash resource attributes", zap.NamedError("reason", err))
			return err
		}
		if err := tw.writeResourceSpans(resourceSpans, tx, resourceId, err); err != nil {
			if err := tx.Rollback(); err != nil {
				tw.logger.Fatal("failed to rollback transaction", zap.NamedError("reason", err))
				panic(err)
			}
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		tw.logger.Error("failed to commit transaction", zap.NamedError("reason", err))
		return err
	}

	return nil
}

func (tw *traceWriter) writeResourceSpans(
	resourceSpans ptrace.ResourceSpans, tx *sql.Tx, resourceId string, err error) error {
	droppedResourceAttributesCount := resourceSpans.Resource().DroppedAttributesCount()
	if err := tw.writeAttributes(tx, resourceSpans.Resource().Attributes(), repository.Resource, resourceId); err != nil {
		return err
	}
	scopeSpansSlice := resourceSpans.ScopeSpans()
	for j := 0; j < scopeSpansSlice.Len(); j++ {
		scopeSpans := scopeSpansSlice.At(j)
		if err = tw.writeScope(scopeSpans, tx, droppedResourceAttributesCount, resourceId); err != nil {
			return err
		}
	}

	return nil
}

func (tw *traceWriter) writeScope(
	scopeSpans ptrace.ScopeSpans, tx *sql.Tx, droppedResourceAttributesCount uint32, resourceId string) error {
	scope := scopeSpans.Scope()
	scopeId, err := repository.InsertScope(tx, scope)
	if err != nil || scopeId == 0 {
		tw.logger.Error("could not insert scope", zap.NamedError("reason", err))
		return err
	}

	if err := tw.writeAttributes(tx, scope.Attributes(), repository.Scope, scopeId); err != nil {
		return err
	}

	spanSlice := scopeSpans.Spans()
	for k := 0; k < spanSlice.Len(); k++ {
		span := spanSlice.At(k)
		if err := tw.writeSpan(tx, span, droppedResourceAttributesCount, resourceId, scopeId); err != nil {
			return err
		}
	}

	return nil
}

func (tw *traceWriter) writeSpan(
	tx *sql.Tx, span ptrace.Span, droppedResourceAttributesCount uint32, resourceId string, scopeId int64) error {
	spanId := span.SpanID().HexString()
	if err := repository.InsertSpan(tx, span, spanId, droppedResourceAttributesCount, resourceId, scopeId); err != nil {
		tw.logger.Error("could not insert span", zap.NamedError("reason", err))
		return err
	}

	if err := tw.writeAttributes(tx, span.Attributes(), repository.Span, spanId); err != nil {
		return err
	}

	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)
		eventId, err := repository.InsertEvent(tx, spanEvent, spanId)
		if err != nil || eventId == 0 {
			tw.logger.Error("could not insert event", zap.NamedError("reason", err))
			return err
		}

		if err := tw.writeAttributes(tx, spanEvent.Attributes(), repository.Event, eventId); err != nil {
			return err
		}
	}

	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		linkId, err := repository.InsertLink(tx, spanLink, spanId)
		if err != nil {
			tw.logger.Error("could not insert event", zap.NamedError("reason", err))
			return err
		}

		if err := tw.writeAttributes(tx, spanLink.Attributes(), repository.Link, linkId); err != nil {
			return err
		}
	}

	return nil
}

func (tw *traceWriter) writeAttributes(
	tx *sql.Tx, attributes pcommon.Map, attributeKind repository.AttributeKind, id any) error {
	for key := range attributes.AsRaw() {
		value, _ := attributes.Get(key)

		finalValue := value.AsRaw()
		if value.Type() == pcommon.ValueTypeSlice { // Temporary handling for array values
			finalValue = value.AsString()
		}

		if err := repository.InsertAttribute(tx, attributeKind, id, key, finalValue, value.Type().String()); err != nil {
			tw.logger.Error(
				"could not insert attribute",
				zap.String("attributeKind", string(attributeKind)),
				zap.String("attributeKey", key),
				zap.String("attributeValue", value.AsString()),
				zap.NamedError("reason", err))
			return err
		}
	}

	return nil
}

func hashAttributes(attributes pcommon.Map) (string, error) {
	// Golang's map implementation deliberately randomizes the order of the keys, so in order to generate a consistent
	// hash, the keys should be sorted before iterating over the map
	sortedKeys := make([]string, 0, len(attributes.AsRaw()))
	for key := range attributes.AsRaw() {
		sortedKeys = append(sortedKeys, key)
	}

	sort.Strings(sortedKeys)

	hash := md5.New()
	for _, key := range sortedKeys {
		value, exists := attributes.Get(key)
		if !exists {
			return "", fmt.Errorf("failed to retrieve value for '%s'", key)
		}
		hash.Write([]byte(fmt.Sprintf("%s:%s", key, value.AsString())))
	}

	return string(hash.Sum(nil)), nil
}
