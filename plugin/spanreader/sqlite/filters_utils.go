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
	"fmt"
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
	"span.duration":                       "spans.duration",
	"span.droppedAttributesCount":         "spans.dropped_attributes_count",
	"span.status.message":                 "spans.status_message",
	"span.status.code":                    "spans.span_status_code",
	"span.droppedResourceAttributesCount": "spans.dropped_resource_attributes_count",
	"span.droppedEventsCount":             "spans.dropped_events_count",
	"span.droppedLinksCount":              "spans.dropped_links_count",
	"externalFields.durationNano":         "spans.duration",
}

var sqliteTableNameMap = map[string]string{
	"span.attributes":          "span_attributes",
	"span.events":              "events",
	"span.event.attributes":    "event_attributes",
	"span.links":               "links",
	"span.link.attributes":     "link_attributes",
	"span.resource.attributes": "span_resource_attributes",
	"resource.attributes":      "resource_attributes",
	"scope.attributes":         "scope_attributes",
	"scope":                    "scopes",
	"span":                     "spans",
}

var existenceCheckFiltersMap = map[model.FilterOperator]model.FilterOperator{
	spansquery.OPERATOR_EXISTS:     spansquery.OPERATOR_EQUALS,
	spansquery.OPERATOR_NOT_EXISTS: spansquery.OPERATOR_NOT_EQUALS,
}

// should be ordered, regular map is not option
var filterTablesNames = []string{"span.attributes", "span.events", "span.event.attributes", "span.links", "span.link.attributes", "span.resource.attributes", "resource.attributes", "scope.attributes", "scope", "span"}

func convertFiltersValues(filters []model.SearchFilter) []model.SearchFilter {
	var convertedFilters []model.SearchFilter
	for _, filter := range filters {
		filterKey := string(filter.KeyValueFilter.Key)
		filterOperator := filter.KeyValueFilter.Operator
		prepareSqliteFilter, err := newSqliteFilter(filterKey)
		if err != nil {
			continue
		}
		var newFilterValue string

		if prepareSqliteFilter.isDynamicTable() {
			if mappedOperator, ok := existenceCheckFiltersMap[filterOperator]; ok {
				filterKey = fmt.Sprintf("%s.key", prepareSqliteFilter.getTableKey())
				convertedFilters = append(convertedFilters, newSearchFilter(filterKey, mappedOperator, fmt.Sprintf("'%s'", prepareSqliteFilter.getTag())))
				continue
			}
			filterKey = createDynamicTagValueField(prepareSqliteFilter.getTableKey())
		}

		values, ok := filter.KeyValueFilter.Value.([]interface{})
		if ok {
			newFilterValue = convertSliceOfValuesToString(values)
		} else if str, ok := filter.KeyValueFilter.Value.(string); ok {
			newFilterValue = fmt.Sprintf("'%s'", str)
		} else {
			continue
		}
		convertedFilters = append(convertedFilters, newSearchFilter(filterKey, filterOperator, newFilterValue))
	}
	return convertedFilters
}

func convertSliceOfValuesToString(values []interface{}) string {
	var valuesStrSlice []string
	for _, value := range values {
		switch value.(type) {
		case string:
			valuesStrSlice = append(valuesStrSlice, fmt.Sprintf("'%s'", value))
		default:
			valuesStrSlice = append(valuesStrSlice, fmt.Sprintf("%v", value))
		}
	}
	return strings.Join(valuesStrSlice, ",")
}

func removeTablePrefixFromDynamicTag(tag string) string {
	for _, tableKey := range filterTablesNames {
		if strings.HasPrefix(tag, tableKey) {
			newTag := strings.ReplaceAll(tag, tableKey+".", "")
			return newTag
		}
	}
	return ""
}

func removeTablePrefixFromStaticTag(tag string) string {
	return strings.Split(tag, ".")[1]
}

func isValidFilter(filter model.SearchFilter) bool {
	if filter.KeyValueFilter == nil {
		return false
	}
	if filter.KeyValueFilter.Key == "" {
		return false
	}
	if op, ok := sqliteOperatorMap[string(filter.KeyValueFilter.Operator)]; ok {
		if op != "IS NOT NULL" && op != "IS NULL" && filter.KeyValueFilter.Value == "" {
			return false
		}
	} else {
		return false
	}
	return true
}

func newSearchFilter(filterKey string, filterOperator model.FilterOperator, filterValue model.FilterValue) model.SearchFilter {
	return model.SearchFilter{
		KeyValueFilter: &model.KeyValueFilter{
			Key:      model.FilterKey(filterKey),
			Operator: filterOperator,
			Value:    filterValue,
		},
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
