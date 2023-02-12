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

package internalspanv1

type SpanEventOption func(spanEvent *SpanEvent)
type SpanOption func(span *Span)
type ExternalFieldsOption func(externalFields *ExternalFields)

type Attributes map[string]any

type SpanEvent struct {
	TimeUnixMilli          uint64     `json:"timeUnixMilli"`
	Name                   string     `json:"name"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type SpanLink struct {
	TraceId                string     `json:"traceId"`
	SpanId                 string     `json:"spanId"`
	TraceState             string     `json:"traceState"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type SpanStatus struct {
	Message string `json:"message"`
	Code    string `json:"code"`
}

type Resource struct {
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type InstrumentationScope struct {
	Name                   string     `json:"name"`
	Version                string     `json:"version"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type Span struct {
	TraceId                string       `json:"traceId"`
	SpanId                 string       `json:"spanId"`
	TraceState             string       `json:"traceState"`
	ParentSpanId           string       `json:"parentSpanId"`
	Name                   string       `json:"name"`
	Kind                   string       `json:"kind"`
	StartTimeUnixMilli     uint64       `json:"startTimeUnixMilli"`
	EndTimeUnixMilli       uint64       `json:"endTimeUnixMilli"`
	Attributes             Attributes   `json:"attributes"`
	DroppedAttributesCount uint32       `json:"droppedAttributesCount"`
	Events                 []*SpanEvent `json:"-"`
	DroppedEventsCount     uint32       `json:"droppedEventsCount"`
	Links                  []*SpanLink  `json:"-"`
	DroppedLinksCount      uint32       `json:"droppedLinksCount"`
	Status                 *SpanStatus  `json:"status"`
}

type ExternalFields struct {
	DurationUnixMilli uint64 `json:"DurationUnixMilli"`
}

type InternalSpan struct {
	Resource               *Resource             `json:"resource"`
	Scope                  *InstrumentationScope `json:"scope"`
	Span                   *Span                 `json:"span"`
	ExternalFields         *ExternalFields       `json:"externalFields"`
	IngestionTimeUnixMilli uint64                `json:"ingestionTimeUnixMilli"`
}
