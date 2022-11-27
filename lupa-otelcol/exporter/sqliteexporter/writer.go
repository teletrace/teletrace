package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/repository"
	"github.com/google/uuid"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

type writer struct {
	logger *zap.Logger
	db     *sql.DB
}

func (w *writer) writeTraces(ctx context.Context, td ptrace.Traces) error {
	tx, err := w.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %+v\n", err)
	}

	resourceSpansSlice := td.ResourceSpans()
	for i := 0; i < resourceSpansSlice.Len(); i++ {
		resourceSpans := resourceSpansSlice.At(i)
		resourceId := uuid.New() // Generating a resource identifier to store with each span
		droppedResourceAttributesCount := resourceSpans.Resource().DroppedAttributesCount()
		scopeSpansSlice := resourceSpans.ScopeSpans()
		for j := 0; j < scopeSpansSlice.Len(); j++ {
			scopeSpans := scopeSpansSlice.At(j)
			w.writeScope(scopeSpans, tx, droppedResourceAttributesCount, resourceId)
		}
		w.writeAttributes(tx, resourceSpans.Resource().Attributes(), repository.Resource, resourceId)
	}

	if err := tx.Commit(); err != nil {
		w.logger.Error("failed to commit transaction", zap.NamedError("reason", err))
	}

	return nil
}

func (w *writer) writeScope(
	scopeSpans ptrace.ScopeSpans, tx *sql.Tx, droppedResourceAttributesCount uint32, resourceId uuid.UUID) {
	scope := scopeSpans.Scope()
	scopeId, err := repository.InsertScope(tx, scope)
	if err != nil || scopeId == nil {
		if err := tx.Rollback(); err != nil {
			w.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
		}
		w.logger.Error("could not insert scope", zap.NamedError("reason", err))
	}

	w.writeAttributes(tx, scope.Attributes(), repository.Scope, scopeId)

	spanSlice := scopeSpans.Spans()
	for k := 0; k < spanSlice.Len(); k++ {
		span := spanSlice.At(k)
		w.writeSpan(tx, span, droppedResourceAttributesCount, resourceId, scopeId)
	}
}

func (w *writer) writeSpan(
	tx *sql.Tx, span ptrace.Span, droppedResourceAttributesCount uint32, resourceId uuid.UUID, scopeId *int64) {
	spanId := span.SpanID().HexString()
	if err := repository.InsertSpan(tx, span, spanId, droppedResourceAttributesCount, resourceId, *scopeId); err != nil {
		if err := tx.Rollback(); err != nil {
			w.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
		}
		w.logger.Error("could not insert span", zap.NamedError("reason", err))
	}

	w.writeAttributes(tx, span.Attributes(), repository.Span, spanId)

	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)
		eventId, err := repository.InsertEvent(tx, spanEvent, spanId)
		if err != nil || eventId == nil {
			if err := tx.Rollback(); err != nil {
				w.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
			}
			w.logger.Error("could not insert event", zap.NamedError("reason", err))
		}

		w.writeAttributes(tx, spanEvent.Attributes(), repository.Event, eventId)
	}

	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		linkId, err := repository.InsertLink(tx, spanLink, spanId)
		if err != nil {
			if err := tx.Rollback(); err != nil {
				w.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
			}
			w.logger.Error("could not insert event", zap.NamedError("reason", err))
		}

		w.writeAttributes(tx, spanLink.Attributes(), repository.Link, linkId)
	}
}

func (w *writer) writeAttributes(tx *sql.Tx, attributes pcommon.Map, attributeKind repository.AttributeKind, id any) {
	for key := range attributes.AsRaw() {
		value, _ := attributes.Get(key)

		finalValue := value.AsRaw()
		// Temporary handling for array values
		if value.Type() == pcommon.ValueTypeSlice {
			finalValue = value.AsString()
		}

		if err := repository.InsertAttribute(
			tx, attributeKind, id, key, finalValue, value.Type().String()); err != nil {
			w.logger.Error(
				"could not insert attribute",
				zap.String("attributeKind", string(attributeKind)),
				zap.String("attributeKey", key),
				zap.String("attributeValue", value.AsString()),
				zap.NamedError("reason", err))
		}
	}
}
