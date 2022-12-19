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

func getTagValuesQuery(r tagsquery.TagValuesRequest, tag string) string {
	dbTableName := findTableName(tag)
	if !isValidTable(dbTableName) {
		return ""
	}
	queryBuilder := newQueryBuilder()
	queryBuilder.addFilters(createTimeframeFilters(*r.Timeframe))
	queryBuilder.addFilters(normalizeFiltersForSqliteFormat(r.SearchFilters))
	queryBuilder.addTable(dbTableName)
	if isDynamicTagsTable(dbTableName) {
		dynamicTag := removeTablePrefixFromDynamicTag(tag)
		if isNotEmptyString(dynamicTag) {
			queryBuilder.addDynamicTagField(dbTableName)
			queryBuilder.addNewDynamicTagFilter(dbTableName, dynamicTag)
		}
	} else {
		if f, ok := sqliteFieldsMap[tag]; ok {
			queryBuilder.addField(f)
		}
	}

	return queryBuilder.buildQuery()
}

func getAllDynamicTagsQuery() string {
	var queryStrings []string
	for tableKey, table := range sqliteTablesMap {
		if isDynamicTagsTable(table) {
			queryStrings = append(queryStrings, fmt.Sprintf("SELECT DISTINCT '%s' as table_key, t.key as tag_name, t.type as tag_type FROM %s t", tableKey, table))
		}
	}
	return strings.Join(queryStrings, " UNION ALL ")
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
