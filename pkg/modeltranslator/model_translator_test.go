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
	"fmt"
	"testing"

	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"

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
		resource.Attributes().PutStr("attribute", fmt.Sprintf("[Resource-%d]attribute", i))
		resource.SetDroppedAttributesCount(1)

		for j := 0; j < 2; j++ {
			scopeSpans := resourceSpans.ScopeSpans().AppendEmpty()
			scope := scopeSpans.Scope()
			scope.SetName(fmt.Sprintf("[InstrumentationScope-%d]Name", j))
			scope.SetVersion(fmt.Sprintf("[InstrumentationScope-%d]Version", j))
			scope.Attributes().PutStr("attribute", fmt.Sprintf("[InstrumentationScope-%d]attribute", j))
			scope.SetDroppedAttributesCount(2)

			for k := 0; k < 2; k++ {
				span := scopeSpans.Spans().AppendEmpty()
				span.SetTraceID(pcommon.TraceID([16]byte{1}))
				span.SetSpanID(pcommon.SpanID([8]byte{2}))
				span.TraceState().FromRaw(fmt.Sprintf("[Span-%d]TraceState", k))
				span.SetParentSpanID(pcommon.SpanID([8]byte{3}))
				span.SetName(fmt.Sprintf("[Span-%d]Name", k))
				span.SetKind(ptrace.SpanKindServer)
				span.SetStartTimestamp(0)
				span.SetEndTimestamp(10)
				span.Attributes().PutStr("attribute", fmt.Sprintf("[Span-%d]attribute", k))
				span.SetDroppedAttributesCount(3)
				span.SetDroppedEventsCount(4)
				span.SetDroppedLinksCount(5)
				span.Status().SetCode(ptrace.StatusCodeOk)
				span.Status().SetMessage(fmt.Sprintf("[SpanStatus-%d]Message", k))

				for l := 0; l < 2; l++ {
					spanEvent := span.Events().AppendEmpty()
					spanEvent.SetTimestamp(5)
					spanEvent.SetName(fmt.Sprintf("[SpanEvent-%d]Name", l))
					spanEvent.Attributes().PutStr("attribute", fmt.Sprintf("[SpanEvent-%d]attribute", l))
					spanEvent.SetDroppedAttributesCount(6)
				}

				for m := 0; m < 2; m++ {
					spanLink := span.Links().AppendEmpty()
					spanLink.SetTraceID(pcommon.TraceID([16]byte{4}))
					spanLink.SetSpanID(pcommon.SpanID([8]byte{5}))
					spanLink.TraceState().FromRaw(fmt.Sprintf("[SpanLink-%d]TraceState", m))
					spanLink.Attributes().PutStr("attribute", fmt.Sprintf("[SpanLink-%d]attribute", m))
					spanLink.SetDroppedAttributesCount(7)
				}
			}
		}
	}

	return td
}

func createExpectedInternalSpans() []*internalspanv1.InternalSpan {
	var spanEvents []*internalspanv1.SpanEvent
	var spanLinks []*internalspanv1.SpanLink
	for i := 0; i < 2; i++ {
		spanEvents = append(spanEvents, &internalspanv1.SpanEvent{
			TimeUnixMilli: 5,
			Name:          fmt.Sprintf("[SpanEvent-%d]Name", i),
			Attributes: internalspanv1.Attributes{
				"attribute": fmt.Sprintf("[SpanEvent-%d]attribute", i),
			},
			DroppedAttributesCount: 6,
		})
		spanLinks = append(spanLinks, &internalspanv1.SpanLink{
			TraceId:    pcommon.TraceID([16]byte{4}).HexString(),
			SpanId:     pcommon.SpanID([8]byte{5}).HexString(),
			TraceState: fmt.Sprintf("[SpanLink-%d]TraceState", i),
			Attributes: internalspanv1.Attributes{
				"attribute": fmt.Sprintf("[SpanLink-%d]attribute", i),
			},
			DroppedAttributesCount: 7,
		})
	}

	var resources []*internalspanv1.Resource
	var scopes []*internalspanv1.InstrumentationScope
	var spans []*internalspanv1.Span
	for i := 0; i < 2; i++ {
		resources = append(resources, &internalspanv1.Resource{
			Attributes: internalspanv1.Attributes{
				"attribute": fmt.Sprintf("[Resource-%d]attribute", i),
			},
			DroppedAttributesCount: 1,
		})
		scopes = append(scopes, &internalspanv1.InstrumentationScope{
			Name:    fmt.Sprintf("[InstrumentationScope-%d]Name", i),
			Version: fmt.Sprintf("[InstrumentationScope-%d]Version", i),
			Attributes: internalspanv1.Attributes{
				"attribute": fmt.Sprintf("[InstrumentationScope-%d]attribute", i),
			},
			DroppedAttributesCount: 2,
		})
		spans = append(spans, &internalspanv1.Span{
			TraceId:            pcommon.TraceID([16]byte{1}).HexString(),
			SpanId:             pcommon.SpanID([8]byte{2}).HexString(),
			TraceState:         fmt.Sprintf("[Span-%d]TraceState", i),
			ParentSpanId:       pcommon.SpanID([8]byte{3}).HexString(),
			Name:               fmt.Sprintf("[Span-%d]Name", i),
			Kind:               "Server",
			StartTimeUnixMilli: 0,
			EndTimeUnixMilli:   10,
			Attributes: internalspanv1.Attributes{
				"attribute": fmt.Sprintf("[Span-%d]attribute", i),
			},
			DroppedAttributesCount: 3,
			Events:                 spanEvents,
			DroppedEventsCount:     4,
			Links:                  spanLinks,
			DroppedLinksCount:      5,
			Status: &internalspanv1.SpanStatus{
				Code:    "Ok",
				Message: fmt.Sprintf("[SpanStatus-%d]Message", i),
			},
		})
	}

	externalFields := &internalspanv1.ExternalFields{
		DurationUnixMilli: 10,
	}

	var internalSpans []*internalspanv1.InternalSpan
	for _, resource := range resources {
		for _, scope := range scopes {
			for _, span := range spans {
				internalSpans = append(internalSpans, &internalspanv1.InternalSpan{
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
