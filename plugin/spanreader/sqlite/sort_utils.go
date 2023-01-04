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

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type sqliteOrder struct {
	tag       string
	tableName string
	tableKey  string
	orderBy   string
}

var orderSqliteFieldsMap = map[string]string{
	"externalFields.durationNano": "span.duration",
	"span.startTimeUnixNano":      "span.start_time_unix_nano",
}

func newSqliteOrder(order spansquery.Sort) (sqliteOrder, error) {
	var so sqliteOrder
	orderField := fmt.Sprintf("%v", order.Field)
	if sqlField, ok := orderSqliteFieldsMap[orderField]; ok {
		for _, tableKey := range filterTablesNames {
			if strings.HasPrefix(sqlField, tableKey) {
				tableName := sqliteTableNameMap[tableKey]
				so.tableName = tableName
				so.tableKey = tableKey
				so.tag = removeTablePrefixFromDynamicTag(sqlField)
				so.orderBy = orderType(order)
				return so, nil
			}
		}
	}
	return so, fmt.Errorf("invalid order field: %s", order.Field)
}

func (so *sqliteOrder) getTableName() string {
	return so.tableName
}

func (so *sqliteOrder) getTableKey() string {
	return so.tableKey
}

func (so *sqliteOrder) getTag() string {
	return so.tag
}

func (so *sqliteOrder) getFieldName() string {
	return fmt.Sprintf("%s.%s", so.tableName, so.tag)
}

func (so *sqliteOrder) getOrderBy() string {
	return so.orderBy
}

func orderType(order spansquery.Sort) string {
	if order.Ascending {
		return "ASC"
	}
	return "DESC"
}
