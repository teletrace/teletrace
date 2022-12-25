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
	"strings"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type SqliteQueryParamsResponse struct {
	tables  string
	fields  string
	filters string
}

func newSqliteQueryParamsResponse(fields string, tables string, filters string) *SqliteQueryParamsResponse {
	return &SqliteQueryParamsResponse{
		fields:  fields,
		tables:  tables,
		filters: filters,
	}
}

type QueryBuilder struct {
	filters     []model.SearchFilter // Filters to be applied to the query
	dbTablesSet *Set                 // Which tables are used in the query
	dbFieldsSet *Set                 // Which fields are used in the query
}

func (qb *QueryBuilder) addFilter(filter model.SearchFilter) error {
	prepareSqliteFilter, err := newSqliteFilter(fmt.Sprintf("%v", filter.KeyValueFilter.Key))
	if err != nil {
		return fmt.Errorf("invalid table name: %s", prepareSqliteFilter.getTableKey())
	}
	if !isValidFilter(filter) {
		return fmt.Errorf("invalid filter: %v", filter)
	}
	filter.KeyValueFilter.Key = model.FilterKey(fmt.Sprintf("%s.%s", prepareSqliteFilter.getTableName(), prepareSqliteFilter.getTag()))
	if !qb.doesTableExist(prepareSqliteFilter.getTableName()) {
		qb.addTable(prepareSqliteFilter.getTableName())
	}
	qb.filters = append(qb.filters, filter)
	return nil
}

func (qb *QueryBuilder) addFilters(filters []model.SearchFilter) error {
	for _, f := range filters {
		err := qb.addFilter(f)
		if err != nil {
			return fmt.Errorf("error adding filter: %v", err)
		}
	}
	return nil
}

func (qb *QueryBuilder) addTable(tableName string) {
	qb.dbTablesSet.Add(tableName)
}

func (qb *QueryBuilder) addField(fieldName string) {
	qb.dbFieldsSet.Add(fieldName)
}

func (qb *QueryBuilder) getTables() []string {
	return qb.dbTablesSet.Values()
}

func (qb *QueryBuilder) getFields() []string {
	return qb.dbFieldsSet.Values()
}

func (qb *QueryBuilder) getFilters() []model.SearchFilter {
	return qb.filters
}

func (qb *QueryBuilder) doesTableExist(tableName string) bool {
	return qb.dbTablesSet.Contains(tableName)
}

func (qb *QueryBuilder) addDynamicTagValueField(tableName string) {
	qb.addField(createDynamicTagValueField(tableName))
}

func (qb *QueryBuilder) addNewDynamicTagFilter(tableName string, tag string) error {
	err := qb.addFilter(newSearchFilter(fmt.Sprintf("%s.%s", tableName, "key"), spansquery.OPERATOR_EQUALS, fmt.Sprintf("'%s'", tag)))
	if err != nil {
		return fmt.Errorf("error adding dynamic tag filter: %v", err)
	}
	return nil
}

func (qb *QueryBuilder) covertFilterToSqliteQuery(filter model.SearchFilter) string {
	filterKey := fmt.Sprintf("%v", filter.KeyValueFilter.Key)
	value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
	switch filter.KeyValueFilter.Operator {
	case spansquery.OPERATOR_EQUALS:
		return fmt.Sprintf("%s = %s", filterKey, value)
	case spansquery.OPERATOR_NOT_EQUALS:
		return fmt.Sprintf("%s != %s", filterKey, value)
	case spansquery.OPERATOR_GT:
		return fmt.Sprintf("%s > %s", filterKey, value)
	case spansquery.OPERATOR_GTE:
		return fmt.Sprintf("%s >= %s", filterKey, value)
	case spansquery.OPERATOR_LT:
		return fmt.Sprintf("%s < %s", filterKey, value)
	case spansquery.OPERATOR_LTE:
		return fmt.Sprintf("%s <= %s", filterKey, value)
	case spansquery.OPERATOR_EXISTS:
		return fmt.Sprintf("%s IS NOT NULL", filterKey)
	case spansquery.OPERATOR_NOT_EXISTS:
		return fmt.Sprintf("%s IS NULL", filterKey)
	case spansquery.OPERATOR_CONTAINS:
		return fmt.Sprintf("%s LIKE '%%%s%%'", filterKey, value)
	case spansquery.OPERATOR_NOT_CONTAINS:
		return fmt.Sprintf("%s NOT LIKE '%%%s%%'", filterKey, value)
	case spansquery.OPERATOR_IN:
		return fmt.Sprintf("%s IN (%s)", filterKey, value)
	case spansquery.OPERATOR_NOT_IN:
		return fmt.Sprintf("%s NOT IN (%s)", filterKey, value)
	default:
		return ""
	}
}

func (qb *QueryBuilder) addJoinConditions() error {
	for _, t := range qb.getTables() {
		var err error
		switch t {
		case "span_attributes":
			err = qb.addFilter(newSearchFilter("span.attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "resource_attributes":
			err = qb.addFilter(newSearchFilter("resource.attributes.resource_id", spansquery.OPERATOR_EQUALS, "spans.resource_id"))
		case "links":
			err = qb.addFilter(newSearchFilter("span.links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "events":
			err = qb.addFilter(newSearchFilter("span.events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "event_attributes":
			err = qb.addFilter(newSearchFilter("span.event.attributes.event_id", spansquery.OPERATOR_EQUALS, "events.id"))
			if err != nil {
				return err
			}
			err = qb.addFilter(newSearchFilter("span.events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "link_attributes":
			err = qb.addFilter(newSearchFilter("span.link.attributes.link_id", spansquery.OPERATOR_EQUALS, "links.id"))
			if err != nil {
				return err
			}
			err = qb.addFilter(newSearchFilter("span.links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "scope_attributes":
			err = qb.addFilter(newSearchFilter("scope.attributes.scope_id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
		}
		if err != nil {
			return err
		}
	}
	return nil
}

func (qb *QueryBuilder) buildQueryParams() (*SqliteQueryParamsResponse, error) {
	err := qb.addJoinConditions()
	if err != nil {
		return nil, fmt.Errorf("error adding join conditions: %v", err)
	}
	filters := qb.buildFilters()
	fields := qb.buildFields()
	tables := qb.buildTables()
	return newSqliteQueryParamsResponse(fields, tables, filters), nil
}

func (qb *QueryBuilder) buildTables() string {
	return strings.Join(qb.getTables(), ",")
}

func (qb *QueryBuilder) buildFields() string {
	if len(qb.getFields()) == 0 {
		return "*"
	}
	return strings.Join(qb.getFields(), ",")
}

func (qb *QueryBuilder) buildFilters() string {
	var filterStrings []string
	for _, filter := range qb.getFilters() {
		filterStrings = append(filterStrings, qb.covertFilterToSqliteQuery(filter))
	}
	return strings.Join(filterStrings, " AND ")
}

func newQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		dbTablesSet: NewSet(),
		dbFieldsSet: NewSet(),
	}
}
