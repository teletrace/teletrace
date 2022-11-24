package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
	"time"
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
			scope := scopeSpans.Scope()
			scopeId, err := w.insertScope(tx, scope)
			if err != nil || scopeId == nil {
				if err := tx.Rollback(); err != nil {
					w.logger.Error("failed to rollback transaction", zap.NamedError("reason", err))
					// TODO: Should there be a panic here?
					panic(fmt.Errorf("failed to rollback transaction: %+v\n", err))
				}
				w.logger.Error("could not insert scope",
					zap.NamedError("reason", err),
				)
			}

			fmt.Printf("scopeId: %v\n", scopeId)
			spanSlice := scopeSpans.Spans()
			for k := 0; k < spanSlice.Len(); k++ {
				span := spanSlice.At(k)
				if err := w.insertSpan(tx, span, droppedResourceAttributesCount, resourceId, *scopeId); err != nil {
					return err
				}
			}
		}
	}

	if err := tx.Commit(); err != nil {
		w.logger.Error("failed to commit transaction", zap.NamedError("reason", err))
	}

	return nil
}

func (w *writer) insertSpan(
	tx *sql.Tx, span ptrace.Span, droppedResourceAttributesCount uint32, resourceId uuid.UUID, scopeId int64) error {
	insertSpanStmt, err := tx.Prepare(`
		INSERT INTO spans (
			span_id, trace_id, trace_state, 
		    parent_span_id, name, kind, start_time_unix_nano, 
		    end_time_unix_nano, dropped_span_attributes_count, dropped_events_count, dropped_links_count, 
		    span_status_message, span_status_code, dropped_resource_attributes_count, duration, 
		    ingestion_time_unix_nano, instrumentation_scope_id, resource_id
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,	?, ?, ?, ?)
	`)

	if err != nil {
		return fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	duration := span.EndTimestamp() - span.StartTimestamp()
	ingestionTimeUnixNano := uint64(time.Now().UTC().Nanosecond()) //  TODO: Check if this is a duration or a timestamp
	if _, err := insertSpanStmt.Exec(
		span.SpanID().HexString(), span.TraceID().HexString(), span.TraceState().AsRaw(),
		span.ParentSpanID().HexString(), span.Name(), int32(span.Kind()), uint64(span.StartTimestamp()),
		uint64(span.EndTimestamp()), span.DroppedAttributesCount(), span.DroppedEventsCount(), span.DroppedLinksCount(),
		span.Status().Message(), span.Status().Code(), droppedResourceAttributesCount, duration,
		ingestionTimeUnixNano, scopeId, resourceId,
	); err != nil {
		return fmt.Errorf("could not execute statement: %v\n", err)
	}

	return nil
}

func (w *writer) insertScope(tx *sql.Tx, scope pcommon.InstrumentationScope) (*int64, error) {
	insertScopeStmt, err := tx.Prepare(
		"INSERT INTO scopes (name, version, dropped_attributes_count) VALUES (?, ?, ?)",
	)

	if err != nil {
		return nil, fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	scopeResult, err := insertScopeStmt.Exec(scope.Name(), scope.Version(), scope.DroppedAttributesCount())
	if err != nil {
		return nil, fmt.Errorf("could not execute statement: %v\n", err)
	}

	scopeId, err := scopeResult.LastInsertId()

	if err != nil {
		return nil, fmt.Errorf("could not retrieve auto-generated scope id: %v\n", err)
	}

	err = insertScopeStmt.Close()
	if err != nil {
		return nil, fmt.Errorf("could not close statement: %v\n", err)
	}

	return &scopeId, nil
}
