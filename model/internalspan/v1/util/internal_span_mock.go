package internalspanv1util

import (
	"time"

	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
)

func GenInternalSpan(s_attr map[string]any, r_attr map[string]any, i_attr map[string]any) *internalspanv1.InternalSpan {
	return &internalspanv1.InternalSpan{
		Resource: &internalspanv1.Resource{
			Attributes: r_attr,
		},
		Scope: &internalspanv1.InstrumentationScope{
			Name:       "scope",
			Version:    "version",
			Attributes: i_attr,
		},
		Span: &internalspanv1.Span{
			TraceId:         "1234567887654321",
			SpanId:          "12345678",
			TraceState:      "state",
			Name:            "span_name",
			Kind:            1,
			EndTimeUnixNano: uint64(time.Now().UTC().Nanosecond()),
			Attributes:      s_attr,
			Status: &internalspanv1.SpanStatus{
				Message: "STATUS_MESSAGE",
				Code:    0,
			},
		},
		ExternalFields: &internalspanv1.ExternalFields{
			DurationNano: 1000000000,
		},
	}
}
