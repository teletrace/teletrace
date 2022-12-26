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
	return fmt.Sprintf("%s", sq.spanId)
}

func (sq *sqliteSpan) getInternalTraceId() string {
	return fmt.Sprintf("%s", sq.traceId)
}

func (sq *sqliteSpan) getInternalTraceState() string {
	return fmt.Sprintf("%s", sq.traceState)
}

func (sq *sqliteSpan) getInternalParentSpanId() string {
	return fmt.Sprintf("%s", sq.parentSpanId)
}

func (sq *sqliteSpan) getInternalSpanName() string {
	return fmt.Sprintf("%s", sq.spanName)
}

func (sq *sqliteSpan) getInternalSpanKind() int32 {
	spanKind, err := strconv.Atoi(fmt.Sprintf("%s", sq.spanKind))
	if err != nil {
		return 0
	}
	return int32(spanKind)
}

func (sq *sqliteSpan) getInternalStartTimeUnixNano() uint64 {
	startTime, err := strconv.ParseUint(fmt.Sprintf("%s", sq.startTimeUnixNano), 10, 64)
	if err != nil {
		return 0
	}
	return startTime
}

func (sq *sqliteSpan) getInternalEndTimeUnixNano() uint64 {
	endTime, err := strconv.ParseUint(fmt.Sprintf("%s", sq.endTimeUnixNano), 10, 64)
	if err != nil {
		return 0
	}
	return endTime
}

func (sq *sqliteSpan) getInternalDroppedSpanAttributesCount() uint32 {
	droppedSpanAttributesCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.droppedSpanAttributesCount))
	if err != nil {
		return 0
	}
	return uint32(droppedSpanAttributesCount)
}

func (sq *sqliteSpan) getInternalResourceDroppedAttributesCount() uint32 {
	resourceDroppedAttributesCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.resourceDroppedAttributesCount))
	if err != nil {
		return 0
	}
	return uint32(resourceDroppedAttributesCount)
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
	durationNano, err := strconv.ParseUint(fmt.Sprintf("%s", sq.durationNano), 10, 64)
	if err != nil {
		return 0
	}
	return durationNano
}

func (sq *sqliteSpan) getInternalIngestionTimeUnixNano() uint64 {
	ingestionTime, err := strconv.ParseUint(fmt.Sprintf("%s", sq.ingestionTimeUnixNano), 10, 64)
	if err != nil {
		return 0
	}
	return ingestionTime
}

func (sq *sqliteSpan) getInternalScopeDroppedAttributesCount() uint32 {
	scopeDroppedAttributesCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.scopeDroppedAttributesCount))
	if err != nil {
		return 0
	}
	return uint32(scopeDroppedAttributesCount)
}

func (sq *sqliteSpan) getInternalEventsDroppedAttributesCount() uint32 {
	eventsDroppedAttributesCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.eventsDroppedAttributesCount))
	if err != nil {
		return 0
	}
	return uint32(eventsDroppedAttributesCount)
}

func (sq *sqliteSpan) getInternalStatusCode() uint32 {
	statusCode, err := strconv.Atoi(fmt.Sprintf("%s", sq.statusCode))
	if err != nil {
		return 0
	}
	return uint32(statusCode)
}

func (sq *sqliteSpan) getInternalLinksDroppedAttributesCount() uint32 {
	linksDroppedAttributesCount, err := strconv.Atoi(fmt.Sprintf("%s", sq.linksDroppedAttributesCount))
	if err != nil {
		return 0
	}
	return uint32(linksDroppedAttributesCount)
}

func (sq *sqliteSpan) getInternalStatusMessage() string {
	return fmt.Sprintf("%s", sq.statusMessage)
}

func (sq *sqliteSpan) getInternalScopeName() string {
	return fmt.Sprintf("%s", sq.scopeName)
}

func (sq *sqliteSpan) getInternalScopeVersion() string {
	return fmt.Sprintf("%s", sq.scopeVersion)
}

func (sq *sqliteSpan) getInternalEventsName() string {
	return fmt.Sprintf("%s", sq.eventsName)
}

func (sq *sqliteSpan) getInternalEventsTimeUnixNano() uint64 {
	eventsTime, err := strconv.ParseUint(fmt.Sprintf("%s", sq.eventsTimeUnixNano), 10, 64)
	if err != nil {
		return 0
	}
	return eventsTime
}

func (sq *sqliteSpan) getInternalLinksTraceId() string {
	return sq.getInternalTraceId()
}

func (sq *sqliteSpan) getInternalLinksSpanId() string {
	return sq.getInternalSpanId()
}

func (sq *sqliteSpan) getInternalLinksTraceState() string {
	return fmt.Sprintf("%s", sq.linksTraceState)
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
