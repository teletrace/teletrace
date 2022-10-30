package modeltranslator

import (
	"fmt"
	v1 "oss-tracing/pkg/model/internalspan/v1"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
)

func TestModelTranslator(t *testing.T) {
	traces := createOTLPTraces()
	expectedInternalSpans := createExpectedInternalSpans()

	actualInternalSpans := TranslateOTLPToInternalModel(traces)

	assert.ElementsMatch(t, expectedInternalSpans, actualInternalSpans)
}

func createOTLPTraces() ptrace.Traces {
	td := ptrace.NewTraces()

	for i := 0; i < 2; i++ {
		resourceSpans := td.ResourceSpans().AppendEmpty()
		resource := resourceSpans.Resource()
		resource.Attributes().InsertString("attribute", fmt.Sprintf("[Resource-%d]attribute", i))
		resource.SetDroppedAttributesCount(1)

		for j := 0; j < 2; j++ {
			scopeSpans := resourceSpans.ScopeSpans().AppendEmpty()
			scope := scopeSpans.Scope()
			scope.SetName(fmt.Sprintf("[InstrumentationScope-%d]Name", j))
			scope.SetVersion(fmt.Sprintf("[InstrumentationScope-%d]Version", j))
			scope.Attributes().InsertString("attribute", fmt.Sprintf("[InstrumentationScope-%d]attribute", j))
			scope.SetDroppedAttributesCount(2)

			for k := 0; k < 2; k++ {
				span := scopeSpans.Spans().AppendEmpty()
				span.SetTraceID(pcommon.NewTraceID([16]byte{1}))
				span.SetSpanID(pcommon.NewSpanID([8]byte{2}))
				span.SetTraceState(ptrace.TraceState(fmt.Sprintf("[Span-%d]TraceState", k)))
				span.SetParentSpanID(pcommon.NewSpanID([8]byte{3}))
				span.SetName(fmt.Sprintf("[Span-%d]Name", k))
				span.SetKind(ptrace.SpanKindServer)
				span.SetStartTimestamp(0)
				span.SetEndTimestamp(10)
				span.Attributes().InsertString("attribute", fmt.Sprintf("[Span-%d]attribute", k))
				span.SetDroppedAttributesCount(3)
				span.SetDroppedEventsCount(4)
				span.SetDroppedLinksCount(5)
				span.Status().SetCode(ptrace.StatusCodeOk)
				span.Status().SetMessage(fmt.Sprintf("[SpanStatus-%d]Message", k))

				for l := 0; l < 2; l++ {
					spanEvent := span.Events().AppendEmpty()
					spanEvent.SetTimestamp(5)
					spanEvent.SetName(fmt.Sprintf("[SpanEvent-%d]Name", l))
					spanEvent.Attributes().InsertString("attribute", fmt.Sprintf("[SpanEvent-%d]attribute", l))
					spanEvent.SetDroppedAttributesCount(6)
				}

				for m := 0; m < 2; m++ {
					spanLink := span.Links().AppendEmpty()
					spanLink.SetTraceID(pcommon.NewTraceID([16]byte{4}))
					spanLink.SetSpanID(pcommon.NewSpanID([8]byte{5}))
					spanLink.SetTraceState(ptrace.TraceState(fmt.Sprintf("[SpanLink-%d]TraceState", m)))
					spanLink.Attributes().InsertString("attribute", fmt.Sprintf("[SpanLink-%d]attribute", m))
					spanLink.SetDroppedAttributesCount(7)
				}
			}
		}
	}

	return td
}

func createExpectedInternalSpans() []*v1.InternalSpan {
	var spanEvents []*v1.SpanEvent
	var spanLinks []*v1.SpanLink
	for i := 0; i < 2; i++ {
		spanEvents = append(spanEvents, &v1.SpanEvent{
			TimeUnixNano: 5,
			Name:         fmt.Sprintf("[SpanEvent-%d]Name", i),
			Attributes: v1.Attributes{
				"attribute": fmt.Sprintf("[SpanEvent-%d]attribute", i),
			},
			DroppedAttributesCount: 6,
		})
		spanLinks = append(spanLinks, &v1.SpanLink{
			TraceId:    [16]byte{4},
			SpanId:     [8]byte{5},
			TraceState: fmt.Sprintf("[SpanLink-%d]TraceState", i),
			Attributes: v1.Attributes{
				"attribute": fmt.Sprintf("[SpanLink-%d]attribute", i),
			},
			DroppedAttributesCount: 7,
		})
	}

	var resources []*v1.Resource
	var scopes []*v1.InstrumentationScope
	var spans []*v1.Span
	for i := 0; i < 2; i++ {
		resources = append(resources, &v1.Resource{
			Attributes: v1.Attributes{
				"attribute": fmt.Sprintf("[Resource-%d]attribute", i),
			},
			DroppedAttributesCount: 1,
		})
		scopes = append(scopes, &v1.InstrumentationScope{
			Name:    fmt.Sprintf("[InstrumentationScope-%d]Name", i),
			Version: fmt.Sprintf("[InstrumentationScope-%d]Version", i),
			Attributes: v1.Attributes{
				"attribute": fmt.Sprintf("[InstrumentationScope-%d]attribute", i),
			},
			DroppedAttributesCount: 2,
		})
		spans = append(spans, &v1.Span{
			TraceId:           [16]byte{1},
			SpanId:            [8]byte{2},
			TraceState:        fmt.Sprintf("[Span-%d]TraceState", i),
			ParentSpanId:      [8]byte{3},
			Name:              fmt.Sprintf("[Span-%d]Name", i),
			Kind:              2, // SERVER
			StartTimeUnixNano: 0,
			EndTimeUnixNano:   10,
			Attributes: v1.Attributes{
				"attribute": fmt.Sprintf("[Span-%d]attribute", i),
			},
			DroppedAttributesCount: 3,
			Events:                 spanEvents,
			DroppedEventsCount:     4,
			Links:                  spanLinks,
			DroppedLinksCount:      5,
			Status: &v1.SpanStatus{
				Code:    1, // OK
				Message: fmt.Sprintf("[SpanStatus-%d]Message", i),
			},
		})
	}

	externalFields := &v1.ExternalFields{
		DurationNano: 10,
	}

	var internalSpans []*v1.InternalSpan
	for _, resource := range resources {
		for _, scope := range scopes {
			for _, span := range spans {
				internalSpans = append(internalSpans, &v1.InternalSpan{
					Resource:       resource,
					Scope:          scope,
					Span:           span,
					ExternalFields: externalFields,
				})
			}
		}
	}

	return internalSpans
}
