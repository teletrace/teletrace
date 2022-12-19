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

type QueryBuilder struct {
	filters     []model.SearchFilter // Filters to be applied to the query
	dbTablesSet *Set                 // Which tables are used in the query
	dbFieldsSet *Set                 // Which fields are used in the query
}

func (qb *QueryBuilder) addFilter(filter model.SearchFilter) error {
	dbTableName := findTableName(fmt.Sprintf("%v", filter.KeyValueFilter.Key))
	if !isValidTable(dbTableName) {
		return fmt.Errorf("invalid table name: %s", dbTableName)
	}
	if !isValidFilter(filter) {
		return fmt.Errorf("invalid filter: %v", filter)
	}
	if !qb.doesTableExist(dbTableName) {
		qb.addTable(dbTableName)
	}
	if isDynamicTagsTable(dbTableName) {
		filter.KeyValueFilter.Key = model.FilterKey(createDynamicTagValueField(dbTableName))
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
	qb.addDynamicTagValueField(tableName)
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

func (qb *QueryBuilder) addJoinConditions() {
	for _, t := range qb.getTables() {
		switch t {
		case "span_attributes":
			err := qb.addFilter(newSearchFilter("span_attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			if err != nil {
				continue
			}
		case "resource_attributes":
			err := qb.addFilter(newSearchFilter("resource_attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.resource_id"))
			if err != nil {
				continue
			}
		case "links":
			err := qb.addFilter(newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			if err != nil {
				continue
			}
		case "events":
			err := qb.addFilter(newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			if err != nil {
				continue
			}
		case "event_attributes":
			err := qb.addFilter(newSearchFilter("event_attributes.event_id", spansquery.OPERATOR_EQUALS, "events.id"))
			if err != nil {
				continue
			}
			err = qb.addFilter(newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			if err != nil {
				continue
			}
		case "link_attributes":
			err := qb.addFilter(newSearchFilter("link_attributes.link_id", spansquery.OPERATOR_EQUALS, "links.id"))
			if err != nil {
				continue
			}
			err = qb.addFilter(newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			if err != nil {
				continue
			}
		case "scope_attributes":
			err := qb.addFilter(newSearchFilter("scope_attributes.scope_id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
			if err != nil {
				continue
			}
		}
	}
}

func (qb *QueryBuilder) getQueryParams() map[string]string {
	qb.addJoinConditions()
	filters := qb.buildFilters()
	fields := qb.buildFields()
	tables := qb.buildTables()
	return map[string]string{
		"tables": tables, "fields": fields, "filters": filters,
	}
}

func (qb *QueryBuilder) buildTables() string {
	return strings.Join(qb.getTables(), ",")
}

func (qb *QueryBuilder) buildFields() string {
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
