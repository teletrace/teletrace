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
	var filters []model.SearchFilter
	filters = append(filters, createTimeframeFilters(r.Timeframe)...)
	filters = append(filters, r.SearchFilters...)
	dbTablesSet := make(map[string]bool)
	dbFieldsSet := make(map[string]bool)
	dbTableName := findTableName(tag)
	if dbTableName != "" {
		var filterStrings []string
		for _, filter := range filters {
			if isValidFilter(filter) {
				dbTableName := findTableName(string(filter.KeyValueFilter.Key))
				if dbTableName != "" {
					if _, ok := dbTablesSet[dbTableName]; !ok {
						dbTablesSet[dbTableName] = true
					}
					value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
					filterStrings = append(filterStrings, fmt.Sprintf("%s %s '%s'", sqliteFieldsMap[string(filter.KeyValueFilter.Key)], sqliteOperatorMap[string(filter.KeyValueFilter.Operator)], value))
				}
			}
		}
		if _, ok := dbTablesSet[dbTableName]; !ok {
			dbTablesSet[dbTableName] = true
		}
		if isDynamicTagsTable(dbTableName) {
			dynamicTag := getDynamicTagValue(tag)
			if dynamicTag != "" {
				dbFieldsSet[dbTableName+".value"] = true
				filter := model.SearchFilter{
					KeyValueFilter: &model.KeyValueFilter{
						Key:      model.FilterKey(dbTableName + ".key"),
						Operator: spansquery.OPERATOR_EQUALS,
						Value:    dynamicTag,
					},
				}
				filterStrings = append(filterStrings, fmt.Sprintf("%s %s '%s'", filter.KeyValueFilter.Key, sqliteOperatorMap[string(filter.KeyValueFilter.Operator)], filter.KeyValueFilter.Value))
				switch dbTableName {
				case "span_attributes":
					filterStrings = append(filterStrings, fmt.Sprintf("%s %s %s", "span_attributes.span_id", sqliteOperatorMap[string(spansquery.OPERATOR_EQUALS)], "spans.span_id"))
				case "resource_attributes":
					filterStrings = append(filterStrings, fmt.Sprintf("%s %s %s", "resource_attributes.resource_id", sqliteOperatorMap[string(spansquery.OPERATOR_EQUALS)], "spans.resource_id"))
				case "links":
					filterStrings = append(filterStrings, fmt.Sprintf("%s %s %s", "links.span_id", sqliteOperatorMap[string(spansquery.OPERATOR_EQUALS)], "spans.span_id"))
				case "events":
					filterStrings = append(filterStrings, fmt.Sprintf("%s %s %s", "events.span_id", sqliteOperatorMap[string(spansquery.OPERATOR_EQUALS)], "spans.span_id"))
				}
				dbTables := make([]string, 0, len(dbTablesSet))
				for table := range dbTablesSet {
					dbTables = append(dbTables, table)
				}
				dbFields := make([]string, 0, len(dbFieldsSet))
				for field := range dbFieldsSet {
					dbFields = append(dbFields, field)
				}
				return fmt.Sprintf("SELECT %s, COUNT(*) FROM %s WHERE %s GROUP BY %s", strings.Join(dbFields, ","), strings.Join(dbTables, ","), strings.Join(filterStrings, " AND "), strings.Join(dbFields, ","))
			}
		} else {
			if f, ok := sqliteFieldsMap[tag]; ok {
				dbFieldsSet[f] = true
			}
			dbTables := make([]string, 0, len(dbTablesSet))
			for table := range dbTablesSet {
				dbTables = append(dbTables, table)
			}
			dbFields := make([]string, 0, len(dbFieldsSet))
			for field := range dbFieldsSet {
				dbFields = append(dbFields, field)
			}

			return fmt.Sprintf("SELECT %s, COUNT(*) FROM %s WHERE %s GROUP BY %s", strings.Join(dbFields, ","), strings.Join(dbTables, ","), strings.Join(filterStrings, " AND "), strings.Join(dbFields, ","))
		}
	}
	return ""
}

func buildQueryByFilters(filters ...model.SearchFilter) string {
	var filterStrings []string
	dbTablesSet := make(map[string]bool)
	for _, filter := range filters {
		if isValidFilter(filter) {
			dbTableName := findTableName(string(filter.KeyValueFilter.Key))
			if dbTableName != "" {
				if _, ok := dbTablesSet[dbTableName]; !ok {
					dbTablesSet[dbTableName] = true
				}
				value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
				filterStrings = append(filterStrings, fmt.Sprintf("%s %s '%s'", sqliteFieldsMap[string(filter.KeyValueFilter.Key)], sqliteOperatorMap[string(filter.KeyValueFilter.Operator)], value))
			}
		}
	}
	dbTables := make([]string, 0, len(dbTablesSet))
	for table := range dbTablesSet {
		dbTables = append(dbTables, table)
	}
	return fmt.Sprintf("SELECT * FROM %s WHERE %s", strings.Join(dbTables, ","), strings.Join(filterStrings, " AND "))
}
