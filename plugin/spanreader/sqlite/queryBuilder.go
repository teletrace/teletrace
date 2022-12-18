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
	filters     []model.SearchFilter
	dbTablesSet *Set
	dbFieldsSet *Set
}

func (qb *QueryBuilder) addFilter(filter model.SearchFilter) {
	if !isValidFilter(filter) {
		return
	}
	qb.filters = append(qb.filters, filter)
}

func (qb *QueryBuilder) addFilters(filters []model.SearchFilter) {
	for _, f := range filters {
		qb.addFilter(f)
	}
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

func (qb *QueryBuilder) tableExists(tableName string) bool {
	return qb.dbTablesSet.Contains(tableName)
}

func (qb *QueryBuilder) addDynamicTagField(tableName string) {
	qb.addField(fmt.Sprintf("%s.%s", tableName, "value"))
}

func (qb *QueryBuilder) addNewDynamicTagFilter(tableName string, tag string) {
	qb.dbFieldsSet.Add(fmt.Sprintf("%s.%s", tableName, "value"))
	switch tableName {
	case "span_attributes":
		qb.addTable("span_attributes")
	case "resource_attributes":
		qb.addTable("resource_attributes")
	case "links":
		qb.addTable("links")
	case "events":
		qb.addTable("events")
	case "event_attributes":
		qb.addTable("event_attributes")
	case "link_attributes":
		qb.addTable("link_attributes")
	case "scope_attributes":
		qb.addTable("scope_attributes")
	}
	qb.addFilter(newSearchFilter(fmt.Sprintf("%s.%s", tableName, "key"), spansquery.OPERATOR_EQUALS, fmt.Sprintf("'%s'", tag)))
}

func (qb *QueryBuilder) covertFilterToSqliteQuery(filter model.SearchFilter) string {
	if isValidFilter(filter) {
		filterKey := fmt.Sprintf("%v", filter.KeyValueFilter.Key)
		value := fmt.Sprintf("%v", filter.KeyValueFilter.Value)
		dbTableName := findTableName(filterKey)
		if !isValidTable(dbTableName) {
			return ""
		}
		if isDynamicTagsTable(dbTableName) {
			filterKey = fmt.Sprintf("%s.%s", dbTableName, "value")
		}
		if !qb.tableExists(dbTableName) {
			qb.addTable(dbTableName)
		}
		return fmt.Sprintf("%s %s (%s)", filterKey, sqliteOperatorMap[string(filter.KeyValueFilter.Operator)], value) //  () for IN
	}
	return ""
}

func (qb *QueryBuilder) optimizeFilters() {
	for _, t := range qb.getTables() {
		switch t {
		case "span_attributes":
			qb.addFilter(newSearchFilter("span_attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "resource_attributes":
			qb.addFilter(newSearchFilter("resource_attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.resource_id"))
		case "links":
			qb.addFilter(newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "events":
			qb.addFilter(newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "event_attributes":
			qb.addFilter(newSearchFilter("event_attributes.event_id", spansquery.OPERATOR_EQUALS, "events.id"))
			qb.addFilter(newSearchFilter("events.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "link_attributes":
			qb.addFilter(newSearchFilter("link_attributes.link_id", spansquery.OPERATOR_EQUALS, "links.id"))
			qb.addFilter(newSearchFilter("links.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
		case "scope_attributes":
			qb.addFilter(newSearchFilter("scope_attributes.scope_id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
		}
	}
}

func (qb *QueryBuilder) buildQuery() string {
	qb.optimizeFilters()
	filters := qb.buildFilters()
	fields := qb.buildFields()
	tables := qb.buildTables()
	return fmt.Sprintf("SELECT %s ,COUNT(*) FROM %s %s", fields, tables, filters)
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
		filterString := qb.covertFilterToSqliteQuery(filter)
		if filterString != "" {
			filterStrings = append(filterStrings, filterString)
		}
	}
	return fmt.Sprintf("WHERE %s", strings.Join(filterStrings, " AND "))
}

func newQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		dbTablesSet: NewSet(),
		dbFieldsSet: NewSet(),
	}
}
