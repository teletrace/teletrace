package repository

import (
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"time"
)

type AttributeKind string

const (
	Span     AttributeKind = "span"
	Resource               = "resource"
	Scope                  = "scope"
	Event                  = "event"
	Link                   = "link"
)

func performInsert(tx *sql.Tx, query string, data ...any) (*int64, error) {
	insertStmt, err := tx.Prepare(query)

	if err != nil {
		return nil, fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	insertResult, err := insertStmt.Exec(data...)
	if err != nil {
		return nil, fmt.Errorf("could not execute statement: %v\n", err)
	}

	linkId, err := insertResult.LastInsertId()

	if err != nil {
		return nil, fmt.Errorf("could not retrieve auto-generated id: %v\n", err)
	}

	err = insertStmt.Close()
	if err != nil {
		return nil, fmt.Errorf("could not close statement: %v\n", err)
	}

	return &linkId, nil
}

func InsertAttribute(tx *sql.Tx, attributeKind AttributeKind, id any, key string, value any, valueType string) error {
	var table string
	var idColumn string
	switch attributeKind {
	case Span:
		table = "span_attributes"
		idColumn = "span_id"
	case Resource:
		table = "resource_attributes"
		idColumn = "resource_id"
	case Scope:
		table = "scope_attributes"
		idColumn = "scope_id"
	case Event:
		table = "event_attributes"
		idColumn = "event_id"
	case Link:
		table = "link_attributes"
		idColumn = "link_id"
	}

	_, err := performInsert(tx,
		fmt.Sprintf("INSERT INTO %s (%s, key, value, type) VALUES (?, ?, ?, ?)", table, idColumn),
		id, key, value, valueType,
	)

	return err
}

func InsertSpan(
	tx *sql.Tx, span ptrace.Span, spanId string, droppedResourceAttributesCount uint32, resourceId uuid.UUID,
	scopeId int64,
) error {
	duration := span.EndTimestamp() - span.StartTimestamp()
	ingestionTimeUnixNano := uint64(time.Now().UTC().Nanosecond())

	_, err := performInsert(tx, `
		INSERT INTO spans (
			span_id, trace_id, trace_state,
		    parent_span_id, name, kind, start_time_unix_nano,
		    end_time_unix_nano, dropped_span_attributes_count, dropped_events_count, dropped_links_count,
		    span_status_message, span_status_code, dropped_resource_attributes_count, duration,
		    ingestion_time_unix_nano, instrumentation_scope_id, resource_id
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,	?, ?, ?, ?)
	`,
		spanId, span.TraceID().HexString(), span.TraceState().AsRaw(),
		span.ParentSpanID().HexString(), span.Name(), int32(span.Kind()), uint64(span.StartTimestamp()),
		uint64(span.EndTimestamp()), span.DroppedAttributesCount(), span.DroppedEventsCount(), span.DroppedLinksCount(),
		span.Status().Message(), span.Status().Code(), droppedResourceAttributesCount, duration,
		ingestionTimeUnixNano, scopeId, resourceId,
	)

	return err
}

func InsertLink(tx *sql.Tx, link ptrace.SpanLink, spanId string) (*int64, error) {
	return performInsert(tx,
		"INSERT INTO links (span_id, trace_state, dropped_attributes_count) VALUES (?, ?, ?)",
		spanId, link.TraceState().AsRaw(), link.DroppedAttributesCount(),
	)
}

func InsertEvent(tx *sql.Tx, event ptrace.SpanEvent, spanId string) (*int64, error) {
	return performInsert(
		tx,
		"INSERT INTO events (span_id, name, time_unix_nano, dropped_attributes_count) VALUES (?, ?, ?, ?)",
		spanId, event.Name(), uint64(event.Timestamp()), event.DroppedAttributesCount(),
	)
}

func InsertScope(tx *sql.Tx, scope pcommon.InstrumentationScope) (*int64, error) {
	return performInsert(tx,
		"INSERT INTO scopes (name, version, dropped_attributes_count) VALUES (?, ?, ?)",
		scope.Name(), scope.Version(), scope.DroppedAttributesCount(),
	)
}
