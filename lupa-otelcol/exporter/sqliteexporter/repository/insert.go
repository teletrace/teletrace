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

func InsertAttribute(tx *sql.Tx, attributeKind AttributeKind, id any, key string, value any, valueType string) error {
	var tableName string
	var idName string
	switch attributeKind {
	case Span:
		tableName = "span_attributes"
		idName = "span_id"
	case Resource:
		tableName = "resource_attributes"
		idName = "resource_id"
	case Scope:
		tableName = "scope_attributes"
		idName = "scope_id"
	case Event:
		tableName = "event_attributes"
		idName = "event_id"
	case Link:
		tableName = "link_attributes"
		idName = "link_id"
	}

	insertSpanAttributeStmt, err := tx.Prepare(
		fmt.Sprintf("INSERT INTO %s (%s, key, value, type) VALUES (?, ?, ?, ?)", tableName, idName),
	)

	if err != nil {
		return fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	if _, err := insertSpanAttributeStmt.Exec(id, key, value, valueType); err != nil {
		return fmt.Errorf("could not execute statement: %v\n", err)
	}

	err = insertSpanAttributeStmt.Close()
	if err != nil {
		return fmt.Errorf("could not close statement: %v\n", err)
	}

	return nil
}

func InsertLink(tx *sql.Tx, link ptrace.SpanLink, spanId string) (*int64, error) {
	insertLinkStmt, err := tx.Prepare(
		"INSERT INTO links (span_id, trace_state, dropped_attributes_count) VALUES (?, ?, ?)",
	)

	if err != nil {
		return nil, fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	insertLinkResult, err := insertLinkStmt.Exec(spanId, link.TraceState().AsRaw(), link.DroppedAttributesCount())
	if err != nil {
		return nil, fmt.Errorf("could not execute statement: %v\n", err)
	}

	linkId, err := insertLinkResult.LastInsertId()

	if err != nil {
		return nil, fmt.Errorf("could not retrieve auto-generated event id: %v\n", err)
	}

	err = insertLinkStmt.Close()
	if err != nil {
		return nil, fmt.Errorf("could not close statement: %v\n", err)
	}

	return &linkId, nil
}

func InsertEvent(tx *sql.Tx, event ptrace.SpanEvent, spanId string) (*int64, error) {
	insertEventStmt, err := tx.Prepare(
		"INSERT INTO events (span_id, name, time_unix_nano, dropped_attributes_count) VALUES (?, ?, ?, ?)",
	)

	if err != nil {
		return nil, fmt.Errorf("could not prepare statement: %+v\n", err)
	}

	eventResult, err := insertEventStmt.Exec(
		spanId, event.Name(), uint64(event.Timestamp()), event.DroppedAttributesCount())

	if err != nil {
		return nil, fmt.Errorf("could not execute statement: %v\n", err)
	}

	eventId, err := eventResult.LastInsertId()

	if err != nil {
		return nil, fmt.Errorf("could not retrieve auto-generated event id: %v\n", err)
	}

	err = insertEventStmt.Close()
	if err != nil {
		return nil, fmt.Errorf("could not close statement: %v\n", err)
	}

	return &eventId, nil
}

func InsertSpan(
	tx *sql.Tx, span ptrace.Span, spanId string, droppedResourceAttributesCount uint32, resourceId uuid.UUID,
	scopeId int64,
) error {
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
		spanId, span.TraceID().HexString(), span.TraceState().AsRaw(),
		span.ParentSpanID().HexString(), span.Name(), int32(span.Kind()), uint64(span.StartTimestamp()),
		uint64(span.EndTimestamp()), span.DroppedAttributesCount(), span.DroppedEventsCount(), span.DroppedLinksCount(),
		span.Status().Message(), span.Status().Code(), droppedResourceAttributesCount, duration,
		ingestionTimeUnixNano, scopeId, resourceId,
	); err != nil {
		return fmt.Errorf("could not execute statement: %v\n", err)
	}

	err = insertSpanStmt.Close()
	if err != nil {
		return fmt.Errorf("could not close statement: %v\n", err)
	}

	return nil
}

func InsertScope(tx *sql.Tx, scope pcommon.InstrumentationScope) (*int64, error) {
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
