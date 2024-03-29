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
	internalspanv1 "github.com/teletrace/teletrace/model/internalspan/v1"

	"go.opentelemetry.io/collector/pdata/ptrace"
)

type TranslationOption func(*internalspanv1.InternalSpan)

// TranslateOTLPToInternalModel converts traces from the OLTP format
// to the InternalSpan model used by the the ingestion pipeline consumers.
func TranslateOTLPToInternalModel(td ptrace.Traces, opts ...TranslationOption) []*internalspanv1.InternalSpan {
	var internalSpans []*internalspanv1.InternalSpan

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
				internalSpan := getInternalSpan(span)
				internalSpanExternalFields := getInternalSpanExternalFields(span)

				iSpan := &internalspanv1.InternalSpan{
					Resource:       internalSpanResource,
					Scope:          internalSpanScope,
					Span:           internalSpan,
					ExternalFields: internalSpanExternalFields,
				}
				for _, opt := range opts {
					opt(iSpan)
				}
				internalSpans = append(internalSpans, iSpan)
			}
		}
	}
	return internalSpans
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

func getInternalSpan(span ptrace.Span) *internalspanv1.Span {
	events := getInternalSpanEvents(span)
	links := getInternalSpanLinks(span)
	status := getInternalSpanStatus(span)

	return &internalspanv1.Span{
		TraceId:                span.TraceID().HexString(),
		SpanId:                 span.SpanID().HexString(),
		TraceState:             span.TraceState().AsRaw(),
		ParentSpanId:           span.ParentSpanID().HexString(),
		Name:                   span.Name(),
		Kind:                   span.Kind().String(),
		StartTimeUnixNano:      uint64(span.StartTimestamp()),
		EndTimeUnixNano:        uint64(span.EndTimestamp()),
		Attributes:             span.Attributes().AsRaw(),
		DroppedAttributesCount: span.DroppedAttributesCount(),
		Events:                 events,
		DroppedEventsCount:     span.DroppedEventsCount(),
		Links:                  links,
		DroppedLinksCount:      span.DroppedLinksCount(),
		Status:                 status,
	}
}

func getInternalSpanEvents(span ptrace.Span) []*internalspanv1.SpanEvent {
	var internalSpanEvents []*internalspanv1.SpanEvent
	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)
		internalSpanEvents = append(internalSpanEvents,
			&internalspanv1.SpanEvent{
				Name:                   spanEvent.Name(),
				Attributes:             spanEvent.Attributes().AsRaw(),
				TimeUnixNano:           uint64(spanEvent.Timestamp()),
				DroppedAttributesCount: spanEvent.DroppedAttributesCount(),
			})
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

func getInternalSpanExternalFields(span ptrace.Span) *internalspanv1.ExternalFields {
	duration := span.EndTimestamp() - span.StartTimestamp()
	return &internalspanv1.ExternalFields{
		DurationNano: uint64(duration),
	}
}

func WithMiliSec() TranslationOption {
	return func(s *internalspanv1.InternalSpan) {
		s.Span.StartTimeUnixNano = uint64(s.Span.StartTimeUnixNano / (1000 * 1000))
		s.Span.EndTimeUnixNano = uint64(s.Span.EndTimeUnixNano / (1000 * 1000))
		s.ExternalFields.DurationNano = uint64(s.ExternalFields.DurationNano / (1000 * 1000))
		for _, e := range s.Span.Events {
			e.TimeUnixNano = uint64(e.TimeUnixNano / (1000 * 1000))
		}
	}
}
