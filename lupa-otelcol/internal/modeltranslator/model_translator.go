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

package modeltranslator

import (
	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
	"go.opentelemetry.io/collector/pdata/ptrace"
)

func SpanWithTimestampsAsMilli() internalspanv1.SpanOption {
	return func(span *internalspanv1.Span) {
		span.StartTimeUnixMilli /= 1e6
		span.EndTimeUnixMilli /= 1e6
	}
}

func SpanEventWithTimestampsAsMilli() internalspanv1.SpanEventOption {
	return func(spanEvent *internalspanv1.SpanEvent) {
		spanEvent.TimeUnixMilli /= 1e6
	}
}

func ExternalFieldsWithTimestampsAsMilli() internalspanv1.ExternalFieldsOption {
	return func(externalFields *internalspanv1.ExternalFields) {
		externalFields.DurationUnixMilli /= 1e6
	}
}

// TranslateOTLPToInternalSpans converts traces from the OLTP format
// to the InternalSpan model used by the Elasticsearch exporters.
func TranslateOTLPToInternalSpans(td ptrace.Traces) <-chan *internalspanv1.InternalSpan {
	ch := make(chan *internalspanv1.InternalSpan)
	go func() {
		resourceSpansSlice := td.ResourceSpans()
		for i := 0; i < resourceSpansSlice.Len(); i++ {
			resourceSpans := resourceSpansSlice.At(i)
			internalSpanResource := getInternalSpanResource(resourceSpans)

			scopeSpansSlice := resourceSpans.ScopeSpans()
			for j := 0; j < scopeSpansSlice.Len(); j++ {
				scopeSpans := scopeSpansSlice.At(j)
				internalSpanScope := getInternalSpanScope(scopeSpans)

				spanSlice := scopeSpans.Spans()
				for k := 0; k < spanSlice.Len(); k++ {
					span := spanSlice.At(k)
					internalSpan := getInternalSpan(span, SpanWithTimestampsAsMilli())
					internalSpanExternalFields := getInternalSpanExternalFields(span, ExternalFieldsWithTimestampsAsMilli())

					ch <- &internalspanv1.InternalSpan{
						Resource:       internalSpanResource,
						Scope:          internalSpanScope,
						Span:           internalSpan,
						ExternalFields: internalSpanExternalFields,
					}
				}
			}
		}
		close(ch)
	}()

	return ch
}

func getInternalSpanResource(resourceSpans ptrace.ResourceSpans) *internalspanv1.Resource {
	resource := resourceSpans.Resource()
	return &internalspanv1.Resource{
		Attributes:             resource.Attributes().AsRaw(),
		DroppedAttributesCount: resource.DroppedAttributesCount(),
	}
}

func getInternalSpanScope(scopeSpans ptrace.ScopeSpans) *internalspanv1.InstrumentationScope {
	scope := scopeSpans.Scope()
	return &internalspanv1.InstrumentationScope{
		Name:                   scope.Name(),
		Version:                scope.Version(),
		Attributes:             scope.Attributes().AsRaw(),
		DroppedAttributesCount: scope.DroppedAttributesCount(),
	}
}

func getInternalSpan(span ptrace.Span, options ...internalspanv1.SpanOption) *internalspanv1.Span {
	events := getInternalSpanEvents(span, SpanEventWithTimestampsAsMilli())
	links := getInternalSpanLinks(span)
	status := getInternalSpanStatus(span)

	internalSpan := &internalspanv1.Span{
		TraceId:                span.TraceID().HexString(),
		SpanId:                 span.SpanID().HexString(),
		TraceState:             span.TraceState().AsRaw(),
		ParentSpanId:           span.ParentSpanID().HexString(),
		Name:                   span.Name(),
		Kind:                   span.Kind().String(),
		StartTimeUnixMilli:     uint64(span.StartTimestamp()),
		EndTimeUnixMilli:       uint64(span.EndTimestamp()),
		Attributes:             span.Attributes().AsRaw(),
		DroppedAttributesCount: span.DroppedAttributesCount(),
		Events:                 events,
		DroppedEventsCount:     span.DroppedEventsCount(),
		Links:                  links,
		DroppedLinksCount:      span.DroppedLinksCount(),
		Status:                 status,
	}

	for _, option := range options {
		option(internalSpan)
	}

	return internalSpan
}

func getInternalSpanEvents(span ptrace.Span, options ...internalspanv1.SpanEventOption) []*internalspanv1.SpanEvent {
	var internalSpanEvents []*internalspanv1.SpanEvent
	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)

		internalSpanEvent := &internalspanv1.SpanEvent{
			Name:                   spanEvent.Name(),
			Attributes:             spanEvent.Attributes().AsRaw(),
			TimeUnixMilli:          uint64(spanEvent.Timestamp()), // convert to MS
			DroppedAttributesCount: spanEvent.DroppedAttributesCount(),
		}

		for _, option := range options {
			option(internalSpanEvent)
		}

		internalSpanEvents = append(internalSpanEvents, internalSpanEvent)
	}

	return internalSpanEvents
}

func getInternalSpanLinks(span ptrace.Span) []*internalspanv1.SpanLink {
	var internalSpanLinks []*internalspanv1.SpanLink
	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		internalSpanLinks = append(internalSpanLinks,
			&internalspanv1.SpanLink{
				TraceId:                spanLink.TraceID().HexString(),
				SpanId:                 spanLink.SpanID().HexString(),
				TraceState:             spanLink.TraceState().AsRaw(),
				Attributes:             spanLink.Attributes().AsRaw(),
				DroppedAttributesCount: spanLink.DroppedAttributesCount(),
			})
	}
	return internalSpanLinks
}

func getInternalSpanStatus(span ptrace.Span) *internalspanv1.SpanStatus {
	return &internalspanv1.SpanStatus{
		Code:    span.Status().Code().String(),
		Message: span.Status().Message(),
	}
}

func getInternalSpanExternalFields(span ptrace.Span, options ...internalspanv1.ExternalFieldsOption) *internalspanv1.ExternalFields {
	externalFields := &internalspanv1.ExternalFields{
		DurationUnixMilli: uint64(span.EndTimestamp() - span.StartTimestamp()), // convert to MS
	}

	for _, option := range options {
		option(externalFields)
	}

	return externalFields
}
