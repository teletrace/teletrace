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
	fieldName string
	tableName string
	orderBy   string
}

func newSqliteOrder(order spansquery.Sort) (*sqliteOrder, error) {
	orderField := fmt.Sprintf("%v", order.Field)
	if fieldName, ok := sqliteFieldsMap[orderField]; ok {
		for _, tableKey := range filterTablesNames {
			if strings.HasPrefix(orderField, tableKey) {
				tableName := sqliteTableNameMap[tableKey]
				return &sqliteOrder{
					fieldName: fieldName,
					tableName: tableName,
					orderBy:   orderType(order),
				}, nil
			}
		}
	}
	return nil, fmt.Errorf("invalid order field: %s", order.Field)
}

func (so *sqliteOrder) buildOrder() string {
	return fmt.Sprintf("%s %s", so.getFieldName(), so.getOrderBy())
}

func (so *sqliteOrder) getTableName() string {
	return so.tableName
}

func (so *sqliteOrder) getFieldName() string {
	return so.fieldName
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
