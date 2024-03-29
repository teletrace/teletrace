/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package sqlitespanreader

import (
	"database/sql"
	"encoding/json"
	"fmt"

	internalspan "github.com/teletrace/teletrace/model/internalspan/v1"
)

type sqliteSpan struct {
	spanId                         sql.NullString
	traceId                        sql.NullString
	traceState                     sql.NullString
	parentSpanId                   sql.NullString
	spanName                       sql.NullString
	spanKind                       sql.NullString
	statusMessage                  sql.NullString
	statusCode                     sql.NullString
	spanAttributes                 sql.NullString
	scopeName                      sql.NullString
	scopeVersion                   sql.NullString
	scopeAttributes                sql.NullString
	eventsAttributes               sql.NullString
	linksAttributes                sql.NullString
	resourceAttributes             sql.NullString
	startTimeUnixNano              sql.NullInt64
	endTimeUnixNano                sql.NullInt64
	droppedSpanAttributesCount     sql.NullInt64
	resourceDroppedAttributesCount sql.NullInt64
	droppedEventsCount             sql.NullInt64
	droppedLinksCount              sql.NullInt64
	durationNano                   sql.NullInt64
	ingestionTimeUnixNano          sql.NullInt64
	scopeDroppedAttributesCount    sql.NullInt64
}

func newSqliteInternalSpan() *sqliteSpan {
	return &sqliteSpan{}
}

func (sq *sqliteSpan) getInternalSpanId() string {
	if sq.spanId.Valid {
		return sq.spanId.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalTraceId() string {
	if sq.traceId.Valid {
		return sq.traceId.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalTraceState() string {
	if sq.traceState.Valid {
		return sq.traceState.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalParentSpanId() string {
	if sq.parentSpanId.Valid {
		return sq.parentSpanId.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalSpanName() string {
	if sq.spanName.Valid {
		return sq.spanName.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalSpanKind() string {
	if sq.spanKind.Valid {
		return sq.spanKind.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalStartTimeUnixNano() uint64 {
	if sq.startTimeUnixNano.Valid {
		return uint64(sq.startTimeUnixNano.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalEndTimeUnixNano() uint64 {
	if sq.endTimeUnixNano.Valid {
		return uint64(sq.endTimeUnixNano.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDroppedSpanAttributesCount() uint32 {
	if sq.droppedSpanAttributesCount.Valid {
		return uint32(sq.droppedSpanAttributesCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalResourceDroppedAttributesCount() uint32 {
	if sq.resourceDroppedAttributesCount.Valid {
		return uint32(sq.resourceDroppedAttributesCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDroppedEventsCount() uint32 {
	if sq.droppedEventsCount.Valid {
		return uint32(sq.droppedEventsCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDroppedLinksCount() uint32 {
	if sq.droppedLinksCount.Valid {
		return uint32(sq.droppedLinksCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDurationNano() uint64 {
	if sq.durationNano.Valid {
		return uint64(sq.durationNano.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalIngestionTimeUnixNano() uint64 {
	if sq.ingestionTimeUnixNano.Valid {
		return uint64(sq.ingestionTimeUnixNano.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalScopeDroppedAttributesCount() uint32 {
	if sq.scopeDroppedAttributesCount.Valid {
		return uint32(sq.scopeDroppedAttributesCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalStatusCode() string {
	if sq.statusCode.Valid {
		return sq.statusCode.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalStatusMessage() string {
	if sq.statusMessage.Valid {
		return sq.statusMessage.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalScopeName() string {
	if sq.scopeName.Valid {
		return sq.scopeName.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalScopeVersion() string {
	if sq.scopeVersion.Valid {
		return sq.scopeVersion.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalLinksTraceId() string {
	return sq.getInternalTraceId()
}

func (sq *sqliteSpan) getInternalLinksSpanId() string {
	return sq.getInternalSpanId()
}

func (sq *sqliteSpan) toInternalSpan() (*internalspan.InternalSpan, error) {
	if !sq.spanId.Valid {
		return nil, fmt.Errorf("spanId is empty")
	}
	var err error
	resourceAttributes := make(map[string]interface{})
	var events []*internalspan.SpanEvent
	spanAttributes := make(map[string]interface{})
	scopeAttributes := make(map[string]interface{})
	var links []*internalspan.SpanLink
	if sq.resourceAttributes.Valid {
		resourceAttributes, err = jsonToAttributesMap(sq.resourceAttributes.String)
		if err != nil {
			return nil, err
		}
	}
	if sq.eventsAttributes.Valid {
		events, err = parseEvents(sq.eventsAttributes.String)
		if err != nil {
			return nil, err
		}
	}

	if sq.spanAttributes.Valid {
		spanAttributes, err = jsonToAttributesMap(sq.spanAttributes.String)
		if err != nil {
			return nil, err
		}
	}

	if sq.scopeAttributes.Valid {
		scopeAttributes, err = jsonToAttributesMap(sq.scopeAttributes.String)
		if err != nil {
			return nil, err
		}
	}
	if sq.linksAttributes.Valid {
		links, err = parseLinks(sq.linksAttributes.String, sq.getInternalLinksSpanId(), sq.getInternalLinksTraceId())
		if err != nil {
			return nil, err
		}
	}

	return &internalspan.InternalSpan{
		Resource: &internalspan.Resource{
			Attributes:             resourceAttributes,
			DroppedAttributesCount: sq.getInternalResourceDroppedAttributesCount(),
		},
		Scope: &internalspan.InstrumentationScope{
			Name:                   sq.getInternalScopeName(),
			Version:                sq.getInternalScopeVersion(),
			Attributes:             scopeAttributes,
			DroppedAttributesCount: sq.getInternalScopeDroppedAttributesCount(),
		},
		Span: &internalspan.Span{
			TraceId:                sq.getInternalTraceId(),
			SpanId:                 sq.getInternalSpanId(),
			TraceState:             sq.getInternalTraceState(),
			ParentSpanId:           sq.getInternalParentSpanId(),
			Name:                   sq.getInternalSpanName(),
			Kind:                   sq.getInternalSpanKind(),
			StartTimeUnixNano:      sq.getInternalStartTimeUnixNano(),
			EndTimeUnixNano:        sq.getInternalEndTimeUnixNano(),
			Attributes:             spanAttributes,
			DroppedAttributesCount: sq.getInternalDroppedSpanAttributesCount(),
			Events:                 events,
			DroppedEventsCount:     sq.getInternalDroppedEventsCount(),
			Links:                  links,
			DroppedLinksCount:      sq.getInternalDroppedLinksCount(),
			Status: &internalspan.SpanStatus{
				Message: sq.getInternalStatusMessage(),
				Code:    sq.getInternalStatusCode(),
			},
		},
		ExternalFields: &internalspan.ExternalFields{
			DurationNano: sq.getInternalDurationNano(),
		},
		IngestionTimeUnixNano: sq.getInternalIngestionTimeUnixNano(),
	}, nil
}

func jsonToAttributesMap(jsonString string) (map[string]interface{}, error) {
	attributesJson := make([]interface{}, 0)
	attributes := make(map[string]interface{})
	err := json.Unmarshal([]byte(jsonString), &attributesJson)
	if err != nil {
		return nil, err
	}
	for _, attr := range attributesJson {
		attrMap := attr.(map[string]interface{})
		key, ok := attrMap["key"].(string)
		if !ok {
			return nil, fmt.Errorf("jsonToAttributesMap: %v is not string", attrMap["key"])
		}
		attributes[key] = attrMap["value"]
	}
	return attributes, nil
}

func parseLinks(jsonString string, spanId string, traceId string) ([]*internalspan.SpanLink, error) {
	linksJson := make([]interface{}, 0)
	links := make([]*internalspan.SpanLink, 0)
	err := json.Unmarshal([]byte(jsonString), &linksJson)
	if err != nil {
		return nil, err
	}
	for _, link := range linksJson {
		linkMap, ok := link.(map[string]interface{})
		if !ok {
			continue
		}
		traceState, ok := linkMap["trace_state"].(string)
		if !ok {
			continue
		}
		droppedAttributesCount, ok := linkMap["dropped_attributes_count"].(float64)
		if !ok {
			continue
		}
		linkAttrJson, ok := linkMap["attributes"].(string)
		if !ok {
			continue
		}
		linkAttr, err := jsonToAttributesMap(linkAttrJson)
		if err != nil {
			return nil, err
		}
		internalLink := internalspan.SpanLink{
			TraceId:                traceId,
			SpanId:                 spanId,
			TraceState:             traceState,
			Attributes:             linkAttr,
			DroppedAttributesCount: uint32(droppedAttributesCount),
		}
		links = append(links, &internalLink)
	}
	return links, nil
}

func parseEvents(jsonString string) ([]*internalspan.SpanEvent, error) {
	eventsJson := make([]interface{}, 0)
	internalEvents := make([]*internalspan.SpanEvent, 0)
	err := json.Unmarshal([]byte(jsonString), &eventsJson)
	if err != nil {
		return nil, err
	}
	for _, event := range eventsJson {
		eventMap, ok := event.(map[string]interface{})
		if !ok {
			continue
		}
		timeUnixNano, ok := eventMap["time_unix_nano"].(float64)
		if !ok {
			continue
		}
		name, ok := eventMap["name"].(string)
		if !ok {
			continue
		}
		droppedAttributesCount, ok := eventMap["dropped_attributes_count"].(float64)
		if !ok {
			continue
		}
		eventAttrJson, ok := eventMap["event_attributes"].(string)
		if !ok {
			continue
		}
		eventAttributes, err := jsonToAttributesMap(eventAttrJson)
		if err != nil {
			return nil, err
		}
		internalEvent := internalspan.SpanEvent{
			TimeUnixNano:           uint64(timeUnixNano),
			Name:                   name,
			DroppedAttributesCount: uint32(droppedAttributesCount),
			Attributes:             eventAttributes,
		}
		internalEvents = append(internalEvents, &internalEvent)
	}
	return internalEvents, nil
}
