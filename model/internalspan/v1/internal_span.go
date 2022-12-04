/**
 * Copyright 2022 Epsagon
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

type Attributes map[string]any

type SpanEvent struct {
	TimeUnixNano           uint64     `json:"timeUnixNano"`
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
	Code    uint32 `json:"code"`
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
	Kind                   int32        `json:"kind"`
	StartTimeUnixNano      uint64       `json:"startTimeUnixNano"`
	EndTimeUnixNano        uint64       `json:"endTimeUnixNano"`
	Attributes             Attributes   `json:"attributes"`
	DroppedAttributesCount uint32       `json:"droppedAttributesCount"`
	Events                 []*SpanEvent `json:"events"`
	DroppedEventsCount     uint32       `json:"droppedEventsCount"`
	Links                  []*SpanLink  `json:"links"`
	DroppedLinksCount      uint32       `json:"droppedLinksCount"`
	Status                 *SpanStatus  `json:"status"`
}

type ExternalFields struct {
	DurationNano uint64 `json:"durationNano"`
}

type InternalSpan struct {
	Resource              *Resource             `json:"resource"`
	Scope                 *InstrumentationScope `json:"scope"`
	Span                  *Span                 `json:"span"`
	ExternalFields        *ExternalFields       `json:"externalFields"`
	IngestionTimeUnixNano uint64                `json:"ingestionTimeUnixNano"`
}
