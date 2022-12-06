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
	"fmt"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"strings"
)

func buildSearchQuery(r spansquery.SearchRequest) string {
	var filters []model.SearchFilter
	filters = append(filters, CreateTimeframeFilters(r.Timeframe)...)
	filters = append(filters, r.SearchFilters...)
	qr := filtersSqliteMapping(filters...)
	return qr
}

func filtersSqliteMapping(filters ...model.SearchFilter) string {
	var sqliteOperatorsMap = map[string]string{
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

	var sqliteTablesMap = map[string]string{
		"span":                  "spans",
		"span.attributes":       "span_attributes",
		"span.events":           "events",
		"span.event.attributes": "event_attributes",
		"span.links":            "links",
		"span.link.attributes":  "link_attributes",
		"resource.attributes":   "resource_attributes",
		"scope.attributes":      "scope_attributes",
		"scope":                 "scopes",
	}
	var filterStrings []string
	var dbTables []string
	for _, filter := range filters {
		if filter.KeyValueFilter != nil && filter.KeyValueFilter.Key != "" && filter.KeyValueFilter.Operator != "" {
			dbTableName := strings.Split(string(filter.KeyValueFilter.Key), ".")[0]
			if !contains(dbTables, sqliteTablesMap[dbTableName]) {
				dbTables = append(dbTables, sqliteTablesMap[dbTableName])
			}
			if len(filterStrings) > 0 {
				filterStrings = append(filterStrings, "AND")
			}
			var value = fmt.Sprintf("%v", filter.KeyValueFilter.Value)
			filterStrings = append(filterStrings, fmt.Sprintf("%s %s '%s'", sqliteFieldsMap[string(filter.KeyValueFilter.Key)], sqliteOperatorsMap[string(filter.KeyValueFilter.Operator)], value))
		}
	}
	return fmt.Sprintf("SELECT * FROM %s WHERE %s", fmt.Sprintf("%s", strings.Join(dbTables, ",")), strings.Join(filterStrings, " "))
}

func contains(tables []string, name string) bool {
	for _, table := range tables {
		if table == name {
			return true
		}
	}
	return false
}

func CreateTimeframeFilters(tf model.Timeframe) []model.SearchFilter {
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
