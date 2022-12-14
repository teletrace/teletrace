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

package sqlitespanreader

import (
	"oss-tracing/pkg/model"
	"strings"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

var sqliteOperatorMap = map[string]string{
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

var sqliteFieldsMap = map[string]string{
	"span.events.name":                    "events.name",
	"span.events.droppedAttributesCount":  "events.dropped_attributes_count",
	"span.events.spanId":                  "events.span_id",
	"span.links.spanId":                   "links.span_id",
	"span.links.traceState":               "links.trace_state",
	"span.links.droppedAttributesCount":   "links.dropped_attributes_count",
	"scope.name":                          "scopes.name",
	"scope.version":                       "scopes.version",
	"scope.droppedAttributesCount":        "scopes.dropped_attributes_count",
	"span.spanId":                         "spans.span_id",
	"span.traceId":                        "spans.trace_id",
	"span.traceState":                     "spans.trace_state",
	"span.parentSpanId":                   "spans.parent_span_id",
	"span.name":                           "spans.name",
	"span.kind":                           "spans.kind",
	"span.startTimeUnixNano":              "spans.start_time_unix_nano",
	"span.endTimeUnixNano":                "spans.end_time_unix_nano",
	"span.droppedAttributesCount":         "spans.dropped_attributes_count",
	"span.status.message":                 "spans.status_message",
	"span.status.code":                    "spans.span_status_code",
	"span.droppedResourceAttributesCount": "spans.dropped_resource_attributes_count",
	"span.droppedEventsCount":             "spans.dropped_events_count",
	"span.droppedLinksCount":              "spans.dropped_links_count",
	"externalFields.durationNano":         "spans.duration",
}

var sqliteTablesMap = map[string]string{
	"span.attributes":       "span_attributes",
	"span.events":           "events",
	"span.event.attributes": "event_attributes",
	"span.links":            "links",
	"span.link.attributes":  "link_attributes",
	"resource.attributes":   "resource_attributes",
	"scope.attributes":      "scope_attributes",
	"scope":                 "scopes",
	"span":                  "spans",
}

// should be ordered, regular map is not option
var tablesMapKeys = []string{"span.attributes", "span.events", "span.event.attributes", "span.links", "span.link.attributes", "resource.attributes", "scope.attributes", "scope", "span"}

func findTableName(filterKey string) string {
	for _, tableKey := range tablesMapKeys {
		if strings.HasPrefix(filterKey, tableKey) {
			return sqliteTablesMap[tableKey]
		}
	}
	return ""
}

func removeTablePrefixFromDynamicTag(tag string) string {
	for _, tableKey := range tablesMapKeys {
		if strings.HasPrefix(tag, tableKey) {
			return strings.ReplaceAll(tag, tableKey+".", "")
		}
	}
	return ""
}

func isValidFilter(filter model.SearchFilter) bool {
	if filter.KeyValueFilter == nil {
		return false
	}
	if _, ok := sqliteFieldsMap[string(filter.KeyValueFilter.Key)]; !ok {
		return false
	}
	if _, ok := sqliteOperatorMap[string(filter.KeyValueFilter.Operator)]; !ok {
		return false
	}
	return true
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
