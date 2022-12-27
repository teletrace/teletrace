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
	"encoding/json"
	"fmt"
	"strconv"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"
)

type sqliteSpan struct {
	spanId, traceId, traceState, parentSpanId, spanName,
	spanKind, statusMessage, statusCode, spanAttributes, scopeName,
	scopeVersion, scopeAttributes, eventsName, eventsAttributes, linksTraceState, linksAttributes, resourceAttributes, startTimeUnixNano, endTimeUnixNano,
	droppedSpanAttributesCount, resourceDroppedAttributesCount,
	droppedEventsCount, droppedLinksCount, durationNano, ingestionTimeUnixNano, scopeDroppedAttributesCount,
	eventsTimeUnixNano, eventsDroppedAttributesCount, linksDroppedAttributesCount interface{}
}

func newSqliteInternalSpan() *sqliteSpan {
	return &sqliteSpan{}
}

func (sq *sqliteSpan) getInternalSpanId() string {
	spanId, ok := sq.spanId.(string)
	if ok {
		return spanId
	}
	return ""
}

func (sq *sqliteSpan) getInternalTraceId() string {
	traceId, ok := sq.traceId.(string)
	if ok {
		return traceId
	}
	return ""
}

func (sq *sqliteSpan) getInternalTraceState() string {
	traceState, ok := sq.traceState.(string)
	if ok {
		return traceState
	}
	return ""
}

func (sq *sqliteSpan) getInternalParentSpanId() string {
	parentSpanId, ok := sq.parentSpanId.(string)
	if ok {
		return parentSpanId
	}
	return ""
}

func (sq *sqliteSpan) getInternalSpanName() string {
	spanName, ok := sq.spanName.(string)
	if ok {
		return spanName
	}
	return ""
}

func (sq *sqliteSpan) getInternalSpanKind() int32 {
	spanKindStr, ok := sq.spanKind.(string)
	if ok {
		spanKind, err := strconv.ParseInt(spanKindStr, 10, 64)
		if err != nil {
			return 0
		}
		return int32(spanKind)
	}
	return 0
}

func (sq *sqliteSpan) getInternalStartTimeUnixNano() uint64 {
	startTime, ok := sq.startTimeUnixNano.(int64)
	if ok {
		return uint64(startTime)
	}
	return 0
}

func (sq *sqliteSpan) getInternalEndTimeUnixNano() uint64 {
	endTime, ok := sq.endTimeUnixNano.(int64)
	if ok {
		return uint64(endTime)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDroppedSpanAttributesCount() uint32 {
	droppedSpanAttributesCount, ok := sq.droppedSpanAttributesCount.(int64)
	if ok {
		return uint32(droppedSpanAttributesCount)
	}
	return 0
}

func (sq *sqliteSpan) getInternalResourceDroppedAttributesCount() uint32 {
	resourceDroppedAttributesCount, ok := sq.resourceDroppedAttributesCount.(int64)
	if ok {
		return uint32(resourceDroppedAttributesCount)
	}
	return 0
}

func (sq *sqliteSpan) getInternalDroppedEventsCount() uint32 {
	droppedEventsCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.droppedEventsCount))
	if err != nil {
		return 0
	}
	return uint32(droppedEventsCount)
}

func (sq *sqliteSpan) getInternalDroppedLinksCount() uint32 {
	droppedLinksCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.droppedLinksCount))
	if err != nil {
		return 0
	}
	return uint32(droppedLinksCount)
}

func (sq *sqliteSpan) getInternalDurationNano() uint64 {
	durationNano, ok := sq.durationNano.(int64)
	if ok {
		return uint64(durationNano)
	}
	return 0
}

func (sq *sqliteSpan) getInternalIngestionTimeUnixNano() uint64 {
	ingestionTime, ok := sq.ingestionTimeUnixNano.(int64)
	if ok {
		return uint64(ingestionTime)
	}
	return 0
}

func (sq *sqliteSpan) getInternalScopeDroppedAttributesCount() uint32 {
	scopeDroppedAttributesCount, ok := sq.scopeDroppedAttributesCount.(int64)
	if ok {
		return uint32(scopeDroppedAttributesCount)
	}
	return 0
}

func (sq *sqliteSpan) getInternalEventsDroppedAttributesCount() uint32 {
	eventsDroppedAttributesCount, ok := sq.eventsDroppedAttributesCount.(int64)
	if ok {
		return uint32(eventsDroppedAttributesCount)
	}
	return 0
}

func (sq *sqliteSpan) getInternalStatusCode() uint32 {
	statusCode, ok := sq.statusCode.(string)
	if ok {
		code, err := strconv.ParseInt(statusCode, 10, 64)
		if err != nil {
			return 0
		}
		return uint32(code)
	}
	return 0
}

func (sq *sqliteSpan) getInternalLinksDroppedAttributesCount() uint32 {
	linksDroppedAttributesCount, ok := sq.linksDroppedAttributesCount.(int64)
	if ok {
		return uint32(linksDroppedAttributesCount)
	}
	return 0
}

func (sq *sqliteSpan) getInternalStatusMessage() string {
	statusMessage, ok := sq.statusMessage.(string)
	if ok {
		return statusMessage
	}
	return ""
}

func (sq *sqliteSpan) getInternalScopeName() string {
	scopeName, ok := sq.scopeName.(string)
	if ok {
		return scopeName
	}
	return ""
}

func (sq *sqliteSpan) getInternalScopeVersion() string {
	scopeVersion, ok := sq.scopeVersion.(string)
	if ok {
		return scopeVersion
	}
	return ""
}

func (sq *sqliteSpan) getInternalEventsName() string {
	eventName, ok := sq.eventsName.(string)
	if ok {
		return eventName
	}
	return ""
}

func (sq *sqliteSpan) getInternalEventsTimeUnixNano() uint64 {
	eventsTime, ok := sq.eventsTimeUnixNano.(int64)
	if ok {
		return uint64(eventsTime)
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
	linkTraceState, ok := sq.linksTraceState.(string)
	if ok {
		return linkTraceState
	}
	return ""
}

func (sq *sqliteSpan) toInternalSpan() (*internalspan.InternalSpan, error) {
	if sq.spanId == nil || sq.spanId == "" {
		return nil, fmt.Errorf("spanId is empty")
	}
	err := error(nil)
	resourceAttributes := make(map[string]interface{})
	eventsAttributes := make(map[string]interface{})
	spanAttributes := make(map[string]interface{})
	scopeAttributes := make(map[string]interface{})
	linkAttributes := make(map[string]interface{})
	if sq.resourceAttributes != nil {
		resourceAttributes, err = jsonToAttributesMap(sq.resourceAttributes.(string))
		if err != nil {
			return nil, err
		}
	}
	if sq.eventsAttributes != nil {
		eventsAttributes, err = jsonToAttributesMap(sq.eventsAttributes.(string))
		if err != nil {
			return nil, err
		}
	}

	if sq.spanAttributes != nil {
		spanAttributes, err = jsonToAttributesMap(sq.spanAttributes.(string))
		if err != nil {
			return nil, err
		}
	}

	if sq.scopeAttributes != nil {
		scopeAttributes, err = jsonToAttributesMap(sq.scopeAttributes.(string))
		if err != nil {
			return nil, err
		}
	}
	if sq.linksAttributes != nil {
		linkAttributes, err = jsonToAttributesMap(sq.linksAttributes.(string))
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
	if err == nil {
		for _, attr := range attributesJson {
			attrMap := attr.(map[string]interface{})
			attributes[attrMap["key"].(string)] = attrMap["value"]
		}
	}
	return attributes, err
}
