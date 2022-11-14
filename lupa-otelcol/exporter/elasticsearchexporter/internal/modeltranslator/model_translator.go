package modeltranslator

import (
	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"

	"go.opentelemetry.io/collector/pdata/ptrace"
)

// TranslateOTLPToInternalSpans converts traces from the OLTP format
// to the InternalSpan model used by the Elasticsearch exporter.
func TranslateOTLPToInternalSpans(td ptrace.Traces) []*internalspanv1.InternalSpan {
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

				internalSpans = append(internalSpans,
					&internalspanv1.InternalSpan{
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
		Code:    uint32(span.Status().Code()),
		Message: span.Status().Message(),
	}
}

func getInternalSpanExternalFields(span ptrace.Span) *internalspanv1.ExternalFields {
	duration := span.EndTimestamp() - span.StartTimestamp()
	return &internalspanv1.ExternalFields{
		DurationNano: uint64(duration),
	}
}
