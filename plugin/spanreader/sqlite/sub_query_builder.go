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

	"github.com/teletrace/teletrace/pkg/model"
)

type subQueryBuilder struct {
	tableQueryMap    map[string][]string
	mainTableName    string
	mainField        string
	mainCondition    string
	mainTableJoinKey string
}

func newSubQueryBuilder(mainTableName string) *subQueryBuilder {
	return &subQueryBuilder{
		mainTableName:    mainTableName,
		tableQueryMap:    make(map[string][]string),
		mainField:        "*",
		mainCondition:    "",
		mainTableJoinKey: "*",
	}
}

func (sqb *subQueryBuilder) getMainTableName() string {
	return sqb.mainTableName
}

func (sqb *subQueryBuilder) getMainField() string {
	return sqb.mainField
}

func (sqb *subQueryBuilder) getMainCondition() string {
	return sqb.mainCondition
}

func (sqb *subQueryBuilder) initTagsQuery(prepareSqliteFilter *sqliteFilter, tag string) error {
	var subQuery string
	tableName := prepareSqliteFilter.getTableName()
	if prepareSqliteFilter.isDynamicTable() {
		subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s = '%s'", getTableJoinKey(tableName), tableName, tableName+".key", prepareSqliteFilter.getTag())
		sqb.mainField = createDynamicTagValueField(tableName)
		sqb.mainCondition = fmt.Sprintf("WHERE %s = '%s'", tableName+".key", prepareSqliteFilter.getTag())
	} else {
		mappedTag := sqliteFieldsMap[tag]
		subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s IS NOT NULL", getTableJoinKey(tableName), tableName, mappedTag)
		sqb.mainField = mappedTag
		sqb.mainCondition = fmt.Sprintf("WHERE %s IS NOT NULL", mappedTag)
	}
	if value, ok := sqb.tableQueryMap[tableName]; ok {
		sqb.tableQueryMap[tableName] = append(value, subQuery)
	} else {
		sqb.tableQueryMap[tableName] = []string{subQuery}
	}
	sqb.mainTableJoinKey = getTableJoinKey(tableName)
	return nil
}

func (sqb *subQueryBuilder) addFiltersToSubQuery(filters []model.SearchFilter) error {
	for _, filter := range filters {
		sqliteFilter, err := newSqliteFilter(string(filter.KeyValueFilter.Key))
		if err != nil {
			return fmt.Errorf("illegal tag name: %s", filter.KeyValueFilter.Key)
		}
		tableName := sqliteFilter.getTableName()
		var subQuery string
		if sqliteFilter.isDynamicTable() {
			key := fmt.Sprintf("%s.%s", sqliteFilter.getTableName(), sqliteFilter.getTag())
			subQuery = fmt.Sprintf("SELECT DISTINCT %s FROM %s WHERE %s", getTableJoinKey(tableName), tableName, covertFilterToSqliteQueryCondition(newSearchFilter(key, filter.KeyValueFilter.Operator, filter.KeyValueFilter.Value)))
		} else {
			key := sqliteFieldsMap[string(filter.KeyValueFilter.Key)]
			subQuery = fmt.Sprintf("SELECT DISTINCT %s FROM %s WHERE %s", getTableJoinKey(tableName), tableName, covertFilterToSqliteQueryCondition(newSearchFilter(key, filter.KeyValueFilter.Operator, filter.KeyValueFilter.Value)))
		}
		if value, ok := sqb.tableQueryMap[tableName]; ok {
			sqb.tableQueryMap[tableName] = append(value, subQuery)
		} else {
			sqb.tableQueryMap[tableName] = []string{subQuery}
		}
	}
	return nil
}

func (sqb *subQueryBuilder) buildSubQuery() (string, error) {
	intersectedQueriesMap := make(map[string]string)
	joinedQueriesMap := make(map[string]string)
	for tableName, queries := range sqb.tableQueryMap {
		intersectedQueriesMap[tableName] = strings.Join(queries, " INTERSECT ")
	}
	for tableName, query := range intersectedQueriesMap {
		sq := innerJoinRelatedTables(tableName, query)
		joinedQueriesMap[tableName] = sq
	}
	subQuery := fmt.Sprintf("SELECT %s FROM (%s) %s", sqb.mainTableJoinKey, joinedQueriesMap[sqb.mainTableName], sqb.mainTableName)
	for tableName, joinQuery := range joinedQueriesMap {
		if tableName == sqb.mainTableName {
			continue
		}
		subQuery = fmt.Sprintf("%s JOIN (%s) %s ON %s.span_id = %s.span_id", subQuery, joinQuery, tableName, sqb.mainTableName, tableName)
	}
	return subQuery, nil
}
