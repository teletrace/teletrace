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
	"externalFields.durationUnixMilli": "span.durationUnixMilli",
	"span.startTimeUnixMilli":          "span.startTimeUnixMilli",
}

func newSqliteOrder(order spansquery.Sort) (sqliteOrder, error) {
	var so sqliteOrder
	orderField := fmt.Sprintf("%v", order.Field)
	if sqlField, ok := orderSqliteFieldsMap[orderField]; ok {
		orderField = sqlField
	}
	for _, tableKey := range filterTablesNames {
		if strings.HasPrefix(orderField, tableKey) {
			tableName := sqliteTableNameMap[tableKey]
			so.tableName = tableName
			so.tableKey = tableKey
			so.tag = removeTablePrefixFromStaticTag(orderField)
			so.orderBy = orderType(order)
			return so, nil
		}
	}
	return so, fmt.Errorf("invalid order field: %s", order.Field)
}

func (so *sqliteOrder) getTableKey() string {
	return so.tableKey
}

func (so *sqliteOrder) getTag() string {
	return so.tag
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
