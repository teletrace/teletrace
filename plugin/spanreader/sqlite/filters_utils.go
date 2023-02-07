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

var tableJoinKeyMap = map[string]string{
	"events_attributes":   "event_id",
	"events":              "id",
	"links_attributes":    "link_id",
	"links":               "id",
	"resource_attributes": "resource_id",
	"scope_attributes":    "scope_id",
	"scopes":              "id",
	"span_attributes":     "span_id",
	"spans":               "span_id",
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
			if filterOperator == spansquery.OPERATOR_CONTAINS || filterOperator == spansquery.OPERATOR_NOT_CONTAINS {
				newFilterValue = str
			} else {
				newFilterValue = fmt.Sprintf("'%s'", str)
			}
		} else if value, ok := filter.KeyValueFilter.Value.(float64); ok {
			newFilterValue = fmt.Sprintf("%v", value)
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

func getTableJoinKey(tableName string) string {
	if key, ok := tableJoinKeyMap[tableName]; ok {
		return fmt.Sprintf("%s.%s", tableName, key)
	}
	return "*"
}

func innerJoinRelatedTables(tableName string, query string) string {
	switch tableName {
	case "event_attributes":
		return fmt.Sprintf("SELECT * FROM events JOIN (%s) event_attributes on events.id = event_attributes.event_id GROUP BY events.id", query)
	case "events":
		return fmt.Sprintf("SELECT * FROM events JOIN (%s) e on events.id = e.id GROUP BY events.id", query)
	case "link_attributes":
		return fmt.Sprintf("SELECT * FROM links JOIN (%s) link_attributes on links.id = link_attributes.link_id GROUP BY links.id", query)
	case "links":
		return fmt.Sprintf("SELECT * FROM links JOIN (%s) l on links.id = l.id GROUP BY links.id", query)
	case "resource_attributes":
		return fmt.Sprintf("SELECT * FROM spans JOIN span_resource_attributes on spans.span_id = span_resource_attributes.span_id JOIN (%s) resource_attributes on span_resource_attributes.resource_attribute_id = resource_attributes.resource_id GROUP BY spans.span_id", query)
	case "scope_attributes":
		return fmt.Sprintf("SELECT * FROM spans JOIN scopes on spans.instrumentation_scope_id = scopes.id JOIN (%s) scope_attributes on scopes.id = scope_attributes.scope_id GROUP BY scopes.id", query)
	case "scopes":
		return fmt.Sprintf("SELECT * FROM spans JOIN (%s) scopes on spans.instrumentation_scope_id = scopes.id GROUP BY scopes.id", query)
	case "span_attributes":
		return fmt.Sprintf("SELECT * FROM spans JOIN (%s) span_attributes on spans.span_id = span_attributes.span_id GROUP BY spans.span_id", query)
	case "spans":
		return fmt.Sprintf("SELECT DISTINCT * FROM spans JOIN (%s) s on spans.span_id = s.span_id GROUP BY spans.span_id", query)
	default:
		return query
	}
}

func covertFilterToSqliteQueryCondition(filter model.SearchFilter) string {
	filterKey := fmt.Sprintf("%v", filter.KeyValueFilter.Key)
	value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
	switch filter.KeyValueFilter.Operator {
	case spansquery.OPERATOR_EQUALS:
		return fmt.Sprintf("%s = %s", filterKey, value)
	case spansquery.OPERATOR_NOT_EQUALS:
		return fmt.Sprintf("%s != %s", filterKey, value)
	case spansquery.OPERATOR_GT:
		return fmt.Sprintf("%s > %s", filterKey, value)
	case spansquery.OPERATOR_GTE:
		return fmt.Sprintf("%s >= %s", filterKey, value)
	case spansquery.OPERATOR_LT:
		return fmt.Sprintf("%s < %s", filterKey, value)
	case spansquery.OPERATOR_LTE:
		return fmt.Sprintf("%s <= %s", filterKey, value)
	case spansquery.OPERATOR_EXISTS:
		return fmt.Sprintf("%s IS NOT NULL", filterKey)
	case spansquery.OPERATOR_NOT_EXISTS:
		return fmt.Sprintf("%s IS NULL", filterKey)
	case spansquery.OPERATOR_CONTAINS:
		return fmt.Sprintf("%s LIKE '%%%s%%'", filterKey, value)
	case spansquery.OPERATOR_NOT_CONTAINS:
		return fmt.Sprintf("%s NOT LIKE '%%%s%%' OR %s IS NULL", filterKey, value, filterKey)
	case spansquery.OPERATOR_IN:
		return fmt.Sprintf("%s IN (%s)", filterKey, value)
	case spansquery.OPERATOR_NOT_IN:
		return fmt.Sprintf("%s NOT IN (%s) OR %s IS NULL", filterKey, value, filterKey)
	default:
		return ""
	}
}
