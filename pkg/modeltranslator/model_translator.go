package modeltranslator

import (
	v1 "oss-tracing/pkg/model/internalspan/v1"

	"go.opentelemetry.io/collector/pdata/ptrace"
)

// TranslateOTLPToInternalModel converts traces from the OLTP format
// to the InternalSpan model used by the the ingestion pipeline consumers.
func TranslateOTLPToInternalModel(td ptrace.Traces) []*v1.InternalSpan {
	var internalSpans []*v1.InternalSpan

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

				internalSpans = append(internalSpans,
					&v1.InternalSpan{
						Resource:       internalSpanResource,
						Scope:          internalSpanScope,
						Span:           internalSpan,
						ExternalFields: internalSpanExternalFields,
					})
			}
		}
	}
	return internalSpans
}

func getInternalSpanResource(resourceSpans ptrace.ResourceSpans) *v1.Resource {
	resource := resourceSpans.Resource()
	return &v1.Resource{
		Attributes:             resource.Attributes().AsRaw(),
		DroppedAttributesCount: resource.DroppedAttributesCount(),
	}
}

func getInternalSpanScope(scopeSpans ptrace.ScopeSpans) *v1.InstrumentationScope {
	scope := scopeSpans.Scope()
	return &v1.InstrumentationScope{
		Name:                   scope.Name(),
		Version:                scope.Version(),
		Attributes:             scope.Attributes().AsRaw(),
		DroppedAttributesCount: scope.DroppedAttributesCount(),
	}
}

func getInternalSpan(span ptrace.Span) *v1.Span {
	events := getInternalSpanEvents(span)
	links := getInternalSpanLinks(span)
	status := getInternalSpanStatus(span)

	return &v1.Span{
		TraceId:                span.TraceID().Bytes(),
		SpanId:                 span.SpanID().Bytes(),
		TraceState:             string(span.TraceState()),
		ParentSpanId:           span.ParentSpanID().Bytes(),
		Name:                   span.Name(),
		Kind:                   int32(span.Kind()),
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

func getInternalSpanEvents(span ptrace.Span) []*v1.SpanEvent {
	var internalSpanEvents []*v1.SpanEvent
	spanEventSlice := span.Events()
	for i := 0; i < spanEventSlice.Len(); i++ {
		spanEvent := spanEventSlice.At(i)
		internalSpanEvents = append(internalSpanEvents,
			&v1.SpanEvent{
				Name:                   spanEvent.Name(),
				Attributes:             spanEvent.Attributes().AsRaw(),
				TimeUnixNano:           uint64(spanEvent.Timestamp()),
				DroppedAttributesCount: spanEvent.DroppedAttributesCount(),
			})
	}
	return internalSpanEvents
}

func getInternalSpanLinks(span ptrace.Span) []*v1.SpanLink {
	var internalSpanLinks []*v1.SpanLink
	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		internalSpanLinks = append(internalSpanLinks,
			&v1.SpanLink{
				TraceId:                spanLink.TraceID().Bytes(),
				SpanId:                 spanLink.SpanID().Bytes(),
				TraceState:             string(spanLink.TraceState()),
				Attributes:             spanLink.Attributes().AsRaw(),
				DroppedAttributesCount: spanLink.DroppedAttributesCount(),
			})
	}
	return internalSpanLinks
}

func getInternalSpanStatus(span ptrace.Span) *v1.SpanStatus {
	return &v1.SpanStatus{
		Code:    uint32(span.Status().Code()),
		Message: span.Status().Message(),
	}
}

func getInternalSpanExternalFields(span ptrace.Span) *v1.ExternalFields {
	duration := span.EndTimestamp() - span.StartTimestamp()
	return &v1.ExternalFields{
		DurationNano: uint64(duration),
	}
}
