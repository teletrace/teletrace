package spanformatutiltests

import (
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
	"time"

	common_v1 "go.opentelemetry.io/proto/otlp/common/v1"
	resource_v1 "go.opentelemetry.io/proto/otlp/resource/v1"
	trace_v1 "go.opentelemetry.io/proto/otlp/trace/v1"
)

func GenExtractedSpan(s_attr map[string]any, r_attr map[string]any, i_attr map[string]any) *v1.ExtractedSpan {
	return &v1.ExtractedSpan{
		Resource: &resource_v1.Resource{
			Attributes: GenAttributes("resource", r_attr),
		},
		ResourceSchemaUrl: "http://url.com",
		Scope: &common_v1.InstrumentationScope{
			Name:       "scope",
			Version:    "version",
			Attributes: GenAttributes("scope", i_attr),
		},
		Span: &trace_v1.Span{
			TraceId:         []byte("UUID_RANDOM"),
			SpanId:          []byte("UUID_RANDOM"),
			TraceState:      "state",
			Name:            "span_name",
			Kind:            trace_v1.Span_SPAN_KIND_INTERNAL,
			EndTimeUnixNano: uint64(time.Now().UTC().Nanosecond()),
			Attributes:      GenAttributes("span", s_attr),
			Status: &trace_v1.Status{
				Message: "STATUS_MESSAGE",
				Code:    trace_v1.Status_STATUS_CODE_OK,
			},
		},
		SpanSchemaUrl: "URL",
		ExternalFields: &v1.ExternalFields{
			DurationNano: 1000000000,
		},
	}
}

func GenAttributes(p string, a map[string]any) []*common_v1.KeyValue {
	var kv []*common_v1.KeyValue
	for k, v := range a {
		if _v, ok := v.(int); ok {
			val := common_v1.AnyValue_IntValue{
				IntValue: int64(_v),
			}

			kv = append(kv,
				&common_v1.KeyValue{
					Key: k,
					Value: &common_v1.AnyValue{
						Value: &val,
					},
				},
			)
		}
		if _v, ok := v.(string); ok {
			val := common_v1.AnyValue_StringValue{
				StringValue: _v,
			}
			kv = append(kv,
				&common_v1.KeyValue{
					Key: k,
					Value: &common_v1.AnyValue{
						Value: &val,
					},
				},
			)
		}
		if _v, ok := v.(bool); ok {
			val := common_v1.AnyValue_BoolValue{
				BoolValue: _v,
			}
			kv = append(kv,
				&common_v1.KeyValue{
					Key: k,
					Value: &common_v1.AnyValue{
						Value: &val,
					},
				},
			)
		}
		if _v, ok := v.(float64); ok {
			val := common_v1.AnyValue_DoubleValue{
				DoubleValue: _v,
			}
			kv = append(kv,
				&common_v1.KeyValue{
					Key: k,
					Value: &common_v1.AnyValue{
						Value: &val,
					},
				},
			)
		}
	}

	return kv
}
