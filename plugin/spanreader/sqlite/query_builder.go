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
	"oss-tracing/pkg/model/tagsquery/v1"
	"strings"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

func buildSearchQuery(r spansquery.SearchRequest) string { // create a query string from the request
	var filters []model.SearchFilter
	filters = append(filters, createTimeframeFilters(r.Timeframe)...)
	filters = append(filters, r.SearchFilters...)
	qr := buildQueryByFilters(filters...)
	return qr
}

func buildTagsValuesQuery(r tagsquery.TagValuesRequest, tag string) string {
	dbTableName := findTableName(tag)
	if dbTableName != "" {
		var filters []model.SearchFilter
		filters = append(filters, createTimeframeFilters(*r.Timeframe)...)
		filters = append(filters, r.SearchFilters...)
		dbTablesSet := NewSet()
		dbFieldsSet := NewSet()
		var filterStrings []string
		dbTablesSet.Add(dbTableName)
		if isDynamicTagsTable(dbTableName) {
			dynamicTag := removeTablePrefixFromDynamicTag(tag)
			if dynamicTag != "" {
				dbFieldsSet.Add(fmt.Sprintf("%s.%s", dbTableName, "value"))
				filters = append(filters, newSearchFilter(fmt.Sprintf("%s.%s", dbTableName, "key"), spansquery.OPERATOR_EQUALS, fmt.Sprintf("'%s'", dynamicTag)))
				switch dbTableName {
				case "span_attributes":
					filters = append(filters, newSearchFilter("span_attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
				case "resource_attributes":
					filters = append(filters, newSearchFilter("resource_attributes.resource_id", spansquery.OPERATOR_EQUALS, "spans.resource_id"))
				case "links":
					filters = append(filters, newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
				case "events":
					filters = append(filters, newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
				case "event_attributes":
					filters = append(filters, newSearchFilter("event_attributes.event_id", spansquery.OPERATOR_EQUALS, "events.id"))
					filters = append(filters, newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
				case "link_attributes":
					filters = append(filters, newSearchFilter("link_attributes.link_id", spansquery.OPERATOR_EQUALS, "links.id"))
					filters = append(filters, newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
				case "scope_attributes":
					filters = append(filters, newSearchFilter("scope_attributes.scope_id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
				}
			}
		} else {
			if f, ok := sqliteFieldsMap[tag]; ok {
				dbFieldsSet.Add(f)
			}
		}
		for _, filter := range filters {
			filterString := covertFilterToSqliteQuery(filter, dbTablesSet)
			if filterString != "" {
				filterStrings = append(filterStrings, filterString)
			}
		}
		return fmt.Sprintf("SELECT %s, COUNT(*) FROM %s WHERE %s GROUP BY %s", strings.Join(dbFieldsSet.Values(), ","), strings.Join(dbTablesSet.Values(), ","), strings.Join(filterStrings, " AND "), strings.Join(dbFieldsSet.Values(), ","))

	}
	return ""
}

func buildQueryByFilters(filters ...model.SearchFilter) string {
	dbTablesSet := make(map[string]bool)
	var filterStrings []string
	for _, filter := range filters {
		if !isValidFilter(filter) {
			continue
		}
		dbTableName := findTableName(string(filter.KeyValueFilter.Key))
		if dbTableName == "" {
			continue
		}
		if _, ok := dbTablesSet[dbTableName]; !ok {
			dbTablesSet[dbTableName] = true
		}
		value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
		filterStrings = append(
			filterStrings,
			fmt.Sprintf(
				"%s %s '%s'",
				sqliteFieldsMap[string(filter.KeyValueFilter.Key)],
				sqliteOperatorMap[string(filter.KeyValueFilter.Operator)],
				value,
			),
		)
	}
	dbTables := make([]string, 0, len(dbTablesSet))
	for table := range dbTablesSet {
		dbTables = append(dbTables, table)
	}
	return fmt.Sprintf("SELECT * FROM %s WHERE %s", strings.Join(dbTables, ","), strings.Join(filterStrings, " AND "))
}
