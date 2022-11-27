package trace_writer

import (
	"database/sql"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/repository"
	"github.com/google/uuid"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
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
		resourceId := uuid.New() // Generating a resource identifier to store with each span
		droppedResourceAttributesCount := resourceSpans.Resource().DroppedAttributesCount()
		scopeSpansSlice := resourceSpans.ScopeSpans()
		for j := 0; j < scopeSpansSlice.Len(); j++ {
			scopeSpans := scopeSpansSlice.At(j)
			tw.writeScope(scopeSpans, tx, droppedResourceAttributesCount, resourceId)
		}
		tw.writeAttributes(tx, resourceSpans.Resource().Attributes(), repository.Resource, resourceId)
	}

	if err := tx.Commit(); err != nil {
		tw.logger.Error("failed to commit transaction", zap.NamedError("reason", err))
	}

	return nil
}

func (tw *traceWriter) writeScope(
	scopeSpans ptrace.ScopeSpans, tx *sql.Tx, droppedResourceAttributesCount uint32, resourceId uuid.UUID) {
	scope := scopeSpans.Scope()
	scopeId, err := repository.InsertScope(tx, scope)
	if err != nil || scopeId == nil {
		if err := tx.Rollback(); err != nil {
			tw.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
		}
		tw.logger.Error("could not insert scope", zap.NamedError("reason", err))
	}

	tw.writeAttributes(tx, scope.Attributes(), repository.Scope, scopeId)

	spanSlice := scopeSpans.Spans()
	for k := 0; k < spanSlice.Len(); k++ {
		span := spanSlice.At(k)
		tw.writeSpan(tx, span, droppedResourceAttributesCount, resourceId, scopeId)
	}
}

func (tw *traceWriter) writeSpan(
	tx *sql.Tx, span ptrace.Span, droppedResourceAttributesCount uint32, resourceId uuid.UUID, scopeId *int64) {
	spanId := span.SpanID().HexString()
	if err := repository.InsertSpan(tx, span, spanId, droppedResourceAttributesCount, resourceId, *scopeId); err != nil {
		if err := tx.Rollback(); err != nil {
			tw.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
		}
		tw.logger.Error("could not insert span", zap.NamedError("reason", err))
	}

	tw.writeAttributes(tx, span.Attributes(), repository.Span, spanId)

	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)
		eventId, err := repository.InsertEvent(tx, spanEvent, spanId)
		if err != nil || eventId == nil {
			if err := tx.Rollback(); err != nil {
				tw.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
			}
			tw.logger.Error("could not insert event", zap.NamedError("reason", err))
		}

		tw.writeAttributes(tx, spanEvent.Attributes(), repository.Event, eventId)
	}

	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		linkId, err := repository.InsertLink(tx, spanLink, spanId)
		if err != nil {
			if err := tx.Rollback(); err != nil {
				tw.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
			}
			tw.logger.Error("could not insert event", zap.NamedError("reason", err))
		}

		tw.writeAttributes(tx, spanLink.Attributes(), repository.Link, linkId)
	}
}

func (tw *traceWriter) writeAttributes(tx *sql.Tx, attributes pcommon.Map, attributeKind repository.AttributeKind, id any) {
	for key := range attributes.AsRaw() {
		value, _ := attributes.Get(key)

		finalValue := value.AsRaw()
		if value.Type() == pcommon.ValueTypeSlice { // Temporary handling for array values
			finalValue = value.AsString()
		}

		if err := repository.InsertAttribute(
			tx, attributeKind, id, key, finalValue, value.Type().String()); err != nil {
			tw.logger.Error(
				"could not insert attribute",
				zap.String("attributeKind", string(attributeKind)),
				zap.String("attributeKey", key),
				zap.String("attributeValue", value.AsString()),
				zap.NamedError("reason", err))
		}
	}
}
