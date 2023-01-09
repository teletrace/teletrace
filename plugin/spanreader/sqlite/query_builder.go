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
	orders  string
}

func newSqliteQueryParamsResponse(fields string, tables string, filters string, orders string) *SqliteQueryParamsResponse {
	return &SqliteQueryParamsResponse{
		fields:  fields,
		tables:  tables,
		filters: filters,
		orders:  orders,
	}
}

type QueryBuilder struct {
	filters     []model.SearchFilter // Filters to be applied to the query
	dbTablesSet *Set                 // Which tables are used in the query
	dbFieldsSet *Set                 // Which fields are used in the query
	orders      []spansquery.Sort    // Which fields are used to order the query
}

func (qb *QueryBuilder) addFilter(filter model.SearchFilter) error {
	prepareSqliteFilter, err := newSqliteFilter(fmt.Sprintf("%v", filter.KeyValueFilter.Key))
	if err != nil {
		return fmt.Errorf("invalid table name: %s", prepareSqliteFilter.getTableKey())
	}
	if !isValidFilter(filter) {
		return fmt.Errorf("invalid filter: %v", filter)
	}
	if prepareSqliteFilter.isDynamicTable() {
		filter.KeyValueFilter.Key = model.FilterKey(fmt.Sprintf("%s.%s", prepareSqliteFilter.getTableName(), prepareSqliteFilter.getTag()))
	} else {
		key := fmt.Sprintf("%s.%s", prepareSqliteFilter.getTableKey(), prepareSqliteFilter.getTag())
		value, ok := sqliteFieldsMap[key]
		if !ok {
			return fmt.Errorf("invalid filter key: %s", key)
		}
		filter.KeyValueFilter.Key = model.FilterKey(removeTablePrefixFromStaticTag(value))
	}
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

func (qb *QueryBuilder) addOrders(orders []spansquery.Sort) {
	qb.orders = append(qb.orders, orders...)
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

func (qb *QueryBuilder) getOrders() []spansquery.Sort {
	return qb.orders
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
			qb.addTable("spans") // added cause filter value is column name
		case "resource_attributes":
			err = qb.addFilter(newSearchFilter("resource.attributes.resource_id", spansquery.OPERATOR_EQUALS, "span_resource_attributes.resource_attribute_id"))
			if err != nil {
				return err
			}
			qb.addTable("span_resource_attributes")
			err = qb.addFilter(newSearchFilter("span.resource.attributes.span_id", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			qb.addTable("spans")
		case "links":
			err = qb.addFilter(newSearchFilter("span.links.spanId", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			qb.addTable("spans")
		case "events":
			err = qb.addFilter(newSearchFilter("span.events.spanId", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			qb.addTable("spans")
		case "event_attributes":
			err = qb.addFilter(newSearchFilter("span.event.attributes.event_id", spansquery.OPERATOR_EQUALS, "events.id"))
			if err != nil {
				return err
			}
			qb.addTable("events")
			err = qb.addFilter(newSearchFilter("span.events.spanId", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			qb.addTable("spans")
		case "link_attributes":
			err = qb.addFilter(newSearchFilter("span.link.attributes.link_id", spansquery.OPERATOR_EQUALS, "links.id"))
			if err != nil {
				return err
			}
			qb.addTable("links")
			err = qb.addFilter(newSearchFilter("span.links.spanId", spansquery.OPERATOR_EQUALS, "spans.span_id"))
			qb.addTable("spans")
		case "scopes":
			err = qb.addFilter(newSearchFilter("scope.id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
			qb.addTable("spans")
		case "scope_attributes":
			err = qb.addFilter(newSearchFilter("scope.attributes.scope_id", spansquery.OPERATOR_EQUALS, "scopes.id"))
			if err != nil {
				return err
			}
			qb.addTable("scope")
			err = qb.addFilter(newSearchFilter("scope.id", spansquery.OPERATOR_EQUALS, "spans.instrumentation_scope_id"))
			qb.addTable("spans")
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
	orders := qb.buildOrders()
	fields := qb.buildFields()
	tables := qb.buildTables()
	return newSqliteQueryParamsResponse(fields, tables, filters, orders), nil
}

func (qb *QueryBuilder) buildTables() string {
	return strings.Join(qb.getTables(), ", ")
}

func (qb *QueryBuilder) buildFields() string {
	if len(qb.getFields()) == 0 {
		return "*"
	}
	return strings.Join(qb.getFields(), ", ")
}

func (qb *QueryBuilder) buildFilters() string {
	if len(qb.getFilters()) == 0 {
		return ""
	}
	var filterStrings []string
	for _, filter := range qb.getFilters() {
		filterStrings = append(filterStrings, qb.covertFilterToSqliteQuery(filter))
	}
	return strings.Join(filterStrings, " AND ")
}

func (qb *QueryBuilder) buildOrders() string {
	if len(qb.getOrders()) == 0 {
		return ""
	}
	var orderStrings []string
	for _, order := range qb.getOrders() {
		parsedOrder, err := newSqliteOrder(order)
		qb.addTable(parsedOrder.getTableName())
		if err != nil {
			return ""
		}
		field, ok := sqliteFieldsMap[fmt.Sprintf("%s.%s", parsedOrder.getTableKey(), parsedOrder.getTag())]
		if !ok {
			return ""
		}
		orderStrings = append(orderStrings, fmt.Sprintf("%s %s", field, parsedOrder.getOrderBy()))
	}
	return strings.Join(orderStrings, ",")
}

func (qb *QueryBuilder) getOrderFromRequest(r spansquery.SearchRequest) (string, error) {
	if r.Metadata != nil && r.Metadata.NextToken != "" {
		extractOrderResponse, err := extractNextToken(r.Sort, r.Metadata.NextToken)
		if err != nil {
			return "", fmt.Errorf("failed to extract next token: %v", err)
		}
		filter := extractOrderResponse.filter
		err = qb.addFilter(filter)
		if err != nil {
			return "", fmt.Errorf("failed to add filter from order: %v", err)
		}
		return extractOrderResponse.sortTag, nil
	}
	return "", nil
}

func newQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		dbTablesSet: NewSet(),
		dbFieldsSet: NewSet(),
	}
}
