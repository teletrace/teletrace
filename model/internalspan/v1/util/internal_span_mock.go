package internalspanv1util

import (
	"time"

	internalspan "github.com/epsagon/lupa/model/internalspan/internalspanv1"
)

func GenInternalSpan(s_attr map[string]any, r_attr map[string]any, i_attr map[string]any) *internalspan.InternalSpan {
	return &internalspan.InternalSpan{
		Resource: &internalspan.Resource{
			Attributes: r_attr,
		},
		Scope: &internalspan.InstrumentationScope{
			Name:       "scope",
			Version:    "version",
			Attributes: i_attr,
		},
		Span: &internalspan.Span{
			TraceId:         "1234567887654321",
			SpanId:          "12345678",
			TraceState:      "state",
			Name:            "span_name",
			Kind:            1,
			EndTimeUnixNano: uint64(time.Now().UTC().Nanosecond()),
			Attributes:      s_attr,
			Status: &internalspan.SpanStatus{
				Message: "STATUS_MESSAGE",
				Code:    0,
			},
		},
		ExternalFields: &internalspan.ExternalFields{
			DurationNano: 1000000000,
		},
	}
}
