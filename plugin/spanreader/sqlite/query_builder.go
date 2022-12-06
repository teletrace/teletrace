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

func buildQueryByFilters(filters ...model.SearchFilter) string {
	var filterStrings []string
	dbTablesSet := make(map[string]bool)
	for _, filter := range filters {
		if isValidFilter(filter) {
			dbTableName := findTableName(string(filter.KeyValueFilter.Key))
			if _, ok := dbTablesSet[dbTableName]; !ok {
				dbTablesSet[dbTableName] = true
			}
			value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
			filterStrings = append(filterStrings, fmt.Sprintf("%s %s '%s'", sqliteFieldsMap[string(filter.KeyValueFilter.Key)], sqliteOperatorMap[string(filter.KeyValueFilter.Operator)], value))
		}
	}
	var dbTables []string
	for table := range dbTablesSet {
		dbTables = append(dbTables, table)
	}
	return fmt.Sprintf("SELECT * FROM %s WHERE %s", strings.Join(dbTables, ","), strings.Join(filterStrings, " AND "))
}
