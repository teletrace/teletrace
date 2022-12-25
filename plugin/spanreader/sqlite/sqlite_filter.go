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
	"strings"
)

type sqliteFilter struct {
	tableName string
	tableKey  string
	tag       string
	isDynamic bool
}

func (ft *sqliteFilter) getTableName() string {
	return ft.tableName
}

func (ft *sqliteFilter) getTableKey() string {
	return ft.tableKey
}

func (ft *sqliteFilter) getTag() string {
	return ft.tag
}

func (ft *sqliteFilter) isDynamicTable() bool {
	return ft.isDynamic
}

func newSqliteFilter(filterKey string) (*sqliteFilter, error) {
	for _, tableKey := range filterTablesNames {
		if strings.HasPrefix(filterKey, tableKey) {
			tableName := sqliteTableNameMap[tableKey]
			return &sqliteFilter{
				tableName: tableName,
				tableKey:  tableKey,
				tag:       removeTablePrefixFromDynamicTag(filterKey),
				isDynamic: isDynamicTagsTable(tableName),
			}, nil
		}
	}
	return nil, fmt.Errorf("table not found for filter key: %s", filterKey)
}
