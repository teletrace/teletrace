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
			TraceId:          "1234567887654321",
			SpanId:           "12345678",
			TraceState:       "state",
			Name:             "span_name",
			Kind:             "INTERNAL",
			EndTimeUnixMilli: uint64(time.Now().UTC().Nanosecond()),
			Attributes:       s_attr,
			Status: &internalspanv1.SpanStatus{
				Message: "STATUS_MESSAGE",
				Code:    "OK",
			},
		},
		ExternalFields: &internalspanv1.ExternalFields{
			DurationUnixMilli: 1000000000,
		},
	}
}
