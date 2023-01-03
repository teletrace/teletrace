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
	"strconv"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"
)

type sqliteSpan struct {
	spanId                         string
	traceId                        string
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
	eventsName                     sql.NullString
	eventsAttributes               sql.NullString
	linksTraceState                sql.NullString
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
	eventsTimeUnixNano             sql.NullInt64
	eventsDroppedAttributesCount   sql.NullInt64
	linksDroppedAttributesCount    sql.NullInt64
}

func newSqliteInternalSpan() *sqliteSpan {
	return &sqliteSpan{}
}

func (sq *sqliteSpan) getInternalSpanId() string {
	return sq.spanId
}

func (sq *sqliteSpan) getInternalTraceId() string {
	return sq.traceId
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

func (sq *sqliteSpan) getInternalSpanKind() int32 {
	if sq.spanKind.Valid {
		spanKind, err := strconv.ParseInt(sq.spanKind.String, 10, 64)
		if err == nil {
			return int32(spanKind)
		}
	}
	return 0
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

func (sq *sqliteSpan) getInternalEventsDroppedAttributesCount() uint32 {
	if sq.eventsDroppedAttributesCount.Valid {
		return uint32(sq.eventsDroppedAttributesCount.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalStatusCode() uint32 {
	if sq.statusCode.Valid {
		statusCode, err := strconv.ParseInt(sq.statusCode.String, 10, 64)
		if err == nil {
			return uint32(statusCode)
		}
	}
	return 0
}

func (sq *sqliteSpan) getInternalLinksDroppedAttributesCount() uint32 {
	if sq.linksDroppedAttributesCount.Valid {
		return uint32(sq.linksDroppedAttributesCount.Int64)
	}
	return 0
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

func (sq *sqliteSpan) getInternalEventsName() string {
	if sq.eventsName.Valid {
		return sq.eventsName.String
	}
	return ""
}

func (sq *sqliteSpan) getInternalEventsTimeUnixNano() uint64 {
	if sq.eventsTimeUnixNano.Valid {
		return uint64(sq.eventsTimeUnixNano.Int64)
	}
	return 0
}

func (sq *sqliteSpan) getInternalLinksTraceId() string {
	return sq.getInternalTraceId()
}

func (sq *sqliteSpan) getInternalLinksSpanId() string {
	return sq.getInternalSpanId()
}

func (sq *sqliteSpan) getInternalLinksTraceState() string {
	if sq.linksTraceState.Valid {
		return sq.linksTraceState.String
	}
	return ""
}

func (sq *sqliteSpan) toInternalSpan() (*internalspan.InternalSpan, error) {
	if sq.spanId == "" {
		return nil, fmt.Errorf("spanId is empty")
	}
	var err error
	resourceAttributes := make(map[string]interface{})
	eventsAttributes := make(map[string]interface{})
	spanAttributes := make(map[string]interface{})
	scopeAttributes := make(map[string]interface{})
	linkAttributes := make(map[string]interface{})
	if sq.resourceAttributes.Valid {
		resourceAttributes, err = jsonToAttributesMap(sq.resourceAttributes.String)
		if err != nil {
			return nil, err
		}
	}
	if sq.eventsAttributes.Valid {
		eventsAttributes, err = jsonToAttributesMap(sq.eventsAttributes.String)
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
		linkAttributes, err = jsonToAttributesMap(sq.linksAttributes.String)
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
			Events: []*internalspan.SpanEvent{
				{
					TimeUnixNano:           sq.getInternalEventsTimeUnixNano(),
					Name:                   sq.getInternalEventsName(),
					Attributes:             eventsAttributes,
					DroppedAttributesCount: sq.getInternalEventsDroppedAttributesCount(),
				},
			},
			DroppedEventsCount: sq.getInternalDroppedEventsCount(),
			Links: []*internalspan.SpanLink{
				{
					TraceId:                sq.getInternalLinksTraceId(),
					SpanId:                 sq.getInternalLinksSpanId(),
					TraceState:             sq.getInternalLinksTraceState(),
					Attributes:             linkAttributes,
					DroppedAttributesCount: sq.getInternalLinksDroppedAttributesCount(),
				},
			},
			DroppedLinksCount: sq.getInternalDroppedLinksCount(),
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
