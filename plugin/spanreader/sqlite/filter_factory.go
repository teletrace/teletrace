/**
 * Copyright 2022 Epsagon
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

package sqlitespanreader

import (
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

var getSqLiteOperator = func() map[string]string {
	return map[string]string{
		spansquery.OPERATOR_EQUALS:       "=",
		spansquery.OPERATOR_NOT_EQUALS:   "!=",
		spansquery.OPERATOR_CONTAINS:     "LIKE",
		spansquery.OPERATOR_NOT_CONTAINS: "NOT LIKE",
		spansquery.OPERATOR_EXISTS:       "IS NOT NULL",
		spansquery.OPERATOR_NOT_EXISTS:   "IS NULL",
		spansquery.OPERATOR_IN:           "IN",
		spansquery.OPERATOR_NOT_IN:       "NOT IN",
		spansquery.OPERATOR_GT:           ">",
		spansquery.OPERATOR_GTE:          ">=",
		spansquery.OPERATOR_LT:           "<",
		spansquery.OPERATOR_LTE:          "<=",
	}
}

var getSqLiteFields = func() map[string]string {
	return map[string]string{
		"span.id":                "spans.span_id",
		"span.traceId":           "spans.trace_id",
		"span.traceState":        "spans.trace_state",
		"span.parentId":          "spans.parent_span_id",
		"span.name":              "spans.name",
		"span.kind":              "spans.kind",
		"span.startTimeUnixNano": "spans.start_time_unix_nano",
		"span.endTimeUnixNano":   "spans.end_time_unix_nano",
		"span.durationNano":      "spans.duration",
		"span.status.code":       "spans.span_status_code",
	}
}

func createTimeframeFilters(tf model.Timeframe) []model.SearchFilter {
	return []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.startTimeUnixNano",
				Operator: spansquery.OPERATOR_GTE,
				Value:    tf.StartTime,
			},
		},
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.endTimeUnixNano",
				Operator: spansquery.OPERATOR_LTE,
				Value:    tf.EndTime,
			},
		},
	}
}
