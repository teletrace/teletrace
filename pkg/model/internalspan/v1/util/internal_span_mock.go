package spanformatutiltests

import (
	v1 "oss-tracing/pkg/model/internalspan/v1"
	"time"
)

func GenInternalSpan(s_attr map[string]any, r_attr map[string]any, i_attr map[string]any) *v1.InternalSpan {
	return &v1.InternalSpan{
		Resource: &v1.Resource{
			Attributes: r_attr,
		},
		Scope: &v1.InstrumentationScope{
			Name:       "scope",
			Version:    "version",
			Attributes: i_attr,
		},
		Span: &v1.Span{
			TraceId:         []byte("UUID_RANDOM"),
			SpanId:          []byte("UUID_RANDOM"),
			TraceState:      "state",
			Name:            "span_name",
			Kind:            1,
			EndTimeUnixNano: uint64(time.Now().UTC().Nanosecond()),
			Attributes:      s_attr,
			Status: &v1.SpanStatus{
				Message: "STATUS_MESSAGE",
				Code:    0,
			},
		},
		ExternalFields: &v1.ExternalFields{
			DurationNano: 1000000000,
		},
	}
}
