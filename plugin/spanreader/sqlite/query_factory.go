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

	"oss-tracing/pkg/model"
	"oss-tracing/pkg/model/tagsquery/v1"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

const (
	LimitOfSpanRecords = 200
)

type searchQueryResponse struct {
	query string
	sort  string
}

func newSearchQueryResponse() *searchQueryResponse {
	return &searchQueryResponse{
		query: "",
		sort:  "",
	}
}

type extractOrderResponse struct {
	filter  model.SearchFilter
	sortTag string
}

func (er *extractOrderResponse) getFilter() model.SearchFilter {
	return er.filter
}

func (er *extractOrderResponse) getSortTag() string {
	return er.sortTag
}

func buildSearchQuery(r spansquery.SearchRequest) (*searchQueryResponse, error) { // create a query string from the request
	searchQueryResponse := newSearchQueryResponse()
	filters := createTimeframeFilters(r.Timeframe)
	filters = append(filters, convertFiltersValues(r.SearchFilters)...)

	queryBuilder := newQueryBuilder()
	err := queryBuilder.addFilters(filters)
	if err != nil {
		return nil, fmt.Errorf("failed to add filters: %v", err)
	}
	queryBuilder.addOrders(r.Sort)
	if err != nil {
		return nil, fmt.Errorf("failed to add orders: %v", err)
	}
	sort, err := queryBuilder.getOrderFromRequest(r)
	if err != nil {
		return nil, fmt.Errorf("failed to get order from request: %v", err)
	}
	searchQueryResponse.sort = sort
	queryParams, err := queryBuilder.buildQueryParams()
	if err != nil {
		return nil, fmt.Errorf("failed to build query params: %v", err)
	}

	err = queryBuilder.addJoinConditions()
	if err != nil {
		return nil, fmt.Errorf("failed to add join conditions: %v", err)
	}
	if queryParams.filters != "" { // add WHERE clause if there are filters
		queryParams.filters = fmt.Sprintf("WHERE %s", queryParams.filters)
	}
	if queryParams.orders != "" { // add ORDER BY clause if there are order by fields
		queryParams.orders = fmt.Sprintf("ORDER BY %s", queryParams.orders)
	}
	searchQueryResponse.query = getSearchQuery(queryBuilder.buildTables(), queryParams.filters, queryParams.orders)
	return searchQueryResponse, nil
}

func getSearchQuery(tables string, filters string, orders string) string {
	spanIdentifiersQuery := fmt.Sprintf("WITH initial_query as (SELECT spans.span_id, spans.instrumentation_scope_id FROM %s %s)", tables, filters) // base query for search query
	internalSpanParamsQuery := " SELECT iq.span_id, spans.trace_id, spans.trace_state, spans.parent_span_id, spans.name, spans.kind, spans.start_time_unix_nano, " +
		"spans.end_time_unix_nano, spans.dropped_span_attributes_count, spans.span_status_message, spans.span_status_code, spans.dropped_resource_attributes_count, " +
		"spans.dropped_events_count, spans.dropped_links_count, spans.duration, spans.ingestion_time_unix_nano, " +
		"span_attributes ,scopes.name, scopes.version, scopes.dropped_attributes_count, scope_attributes, events, links, resources FROM initial_query AS iq " // query for internal span params
	spanSchemaJoinQuery := " JOIN spans ON spans.span_id = iq.span_id " // join spans table for internal span params
	resourceAttributesJoinQuery := " LEFT JOIN " +
		"(SELECT span_resource_attributes.span_id, json_group_array(json_object('key', span_resource_attributes.key, 'value', span_resource_attributes.value, 'type', span_resource_attributes.type)) " + // join table with all span's resources as json
		"AS resources " + "FROM (SELECT * FROM resource_attributes JOIN span_resource_attributes " +
		"AS sr ON resource_attributes.resource_id = sr.resource_attribute_id) " + // sub-table with all resource attributes and span_id mapped by resource id
		"AS span_resource_attributes " +
		"GROUP BY span_resource_attributes.span_id) " +
		"AS resource_attributes " +
		"ON resource_attributes.span_id = iq.span_id " // join resource attributes table for internal span params
	spanAttributesJoinQuery := " LEFT JOIN " +
		"(SELECT span_attributes.span_id, json_group_array(json_object('key', span_attributes.key, 'value', span_attributes.value, 'type', span_attributes.type)) " + // join table with all span's attributes as json
		"AS span_attributes FROM span_attributes GROUP BY span_attributes.span_id) " +
		"AS span_attributes ON iq.span_id = span_attributes.span_id " // join span attributes table for internal span params
	scopesJoinQuery := " LEFT JOIN " +
		"(SELECT scope_attributes.id, scope_attributes.name, scope_attributes.version, scope_attributes.dropped_attributes_count, scope_attributes.scope_attributes  " +
		"FROM (SELECT scopes.id, scopes.name, scopes.version, scopes.dropped_attributes_count, json_group_array(json_object('key', sa.key, 'value', sa.value, 'type', sa.type)) " + // join between scopes and scope attributes for map between scope and theirs attributes
		"AS scope_attributes FROM scopes " +
		"JOIN scope_attributes AS sa ON scopes.id = sa.scope_id) " +
		"AS scope_attributes GROUP BY scope_attributes.id) " +
		"AS scopes ON scopes.id = iq.instrumentation_scope_id " // join between new scopes sub-table and their spans.
	eventsJoinQuery := " LEFT JOIN " +
		"(SELECT events.span_id, json_group_array(json_object('time_unix_nano', events.time_unix_nano, 'name', events.name, 'dropped_attributes_count', events.dropped_attributes_count, 'event_attributes', events.event_attributes)) " +
		"AS events " +
		"FROM " +
		"(SELECT events.span_id, events.time_unix_nano, events.name, events.dropped_attributes_count, json_group_array(json_object('key', ea.key, 'value', ea.value)) " +
		"AS event_attributes FROM events " +
		"JOIN event_attributes ea ON events.id = ea.event_id GROUP BY events.id) " + // join between events and event attributes for map between event and theirs attributes
		"AS events GROUP BY events.span_id) " +
		"AS events ON events.span_id = iq.span_id " // join between events and spans
	LinksJoinQuery := " LEFT JOIN " +
		"(SELECT links.span_id, json_group_array(json_object('trace_state', links.trace_state, 'name', links.dropped_attributes_count, 'link_attributes', links.link_attributes)) " +
		"AS links FROM " +
		"(SELECT links.span_id, links.trace_state, links.dropped_attributes_count,  json_group_array(json_object('key', la.key, 'value', la.value)) " +
		"AS link_attributes FROM links " +
		"JOIN link_attributes la ON links.id = la.link_id GROUP BY links.id) " + // join between links and link attributes for map between link and theirs attributes
		"AS links GROUP BY links.span_id) " +
		"AS links ON links.span_id = iq.span_id " // join between links and spans
	groupQuery := " GROUP BY iq.span_id "                      // group by span_id internal span params
	limitQuery := fmt.Sprintf(" LIMIT %d", LimitOfSpanRecords) // set limit on number of records
	return spanIdentifiersQuery + internalSpanParamsQuery + spanSchemaJoinQuery + resourceAttributesJoinQuery + spanAttributesJoinQuery + scopesJoinQuery + eventsJoinQuery + LinksJoinQuery + groupQuery + orders + limitQuery
}

func extractNextToken(orders []spansquery.Sort, nextToken spansquery.ContinuationToken) (*extractOrderResponse, error) {
	if len(orders) > 1 {
		return nil, fmt.Errorf("expected a single sort field, but found: %v", len(orders))
	}
	order := orders[0]
	sqliteOrder, err := newSqliteOrder(order)
	if err != nil {
		return nil, fmt.Errorf("failed to parse order: %v", err)
	}
	var filter model.SearchFilter
	switch sqliteOrder.orderBy {
	case "DESC":
		filter = newSearchFilter(fmt.Sprintf("%s.%s", sqliteOrder.getTableKey(), sqliteOrder.getTag()), spansquery.OPERATOR_LT, nextToken)
	case "ASC":
		filter = newSearchFilter(fmt.Sprintf("%s.%s", sqliteOrder.getTableKey(), sqliteOrder.getTag()), spansquery.OPERATOR_GT, nextToken)
	}
	if filter.KeyValueFilter == nil {
		return nil, fmt.Errorf("failed to create filter from order: %v", order)
	}
	return &extractOrderResponse{
		filter:  filter,
		sortTag: sqliteOrder.getTag(),
	}, nil
}

func covertFilterToSqliteQuery(filter model.SearchFilter) string {
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

func joinRelatedTables(tableName string, query string) string {
	switch tableName {
	case "event_attributes":
		return fmt.Sprintf("SELECT * FROM events JOIN (%s) event_attributes on events.id = event_attributes.event_id GROUP BY events.id", query)
	case "events":
		return fmt.Sprintf("SELECT * FROM events JOIN (%s) e on events.id = e.id GROUP BY events.id", query)
	case "link_attributes":
		return fmt.Sprintf("SELECT * FROM links JOIN (%s) link_attributes on links.id = link_attributes.link_id GROUP BY links.id", query)
	case "links":
		return fmt.Sprintf("SELECT * FROM links JOIN (%s) l on links.id = l.id GROUP BY links.id", query)
	case "resource_attributes":
		return fmt.Sprintf("SELECT * FROM spans JOIN span_resource_attributes on spans.span_id = span_resource_attributes.span_id JOIN (%s) resource_attributes on span_resource_attributes.resource_attribute_id = resource_attributes.resource_id GROUP BY spans.span_id", query)
	case "scope_attributes":
		return fmt.Sprintf("SELECT * FROM spans JOIN scopes on spans.instrumentation_scope_id = scopes.id JOIN (%s) scope_attributes on scopes.id = scope_attributes.scope_id GROUP BY scopes.id", query)
	case "scopes":
		return fmt.Sprintf("SELECT * FROM spans JOIN (%s) scopes on spans.instrumentation_scope_id = scopes.id GROUP BY scopes.id", query)
	default:
		return query
	}
}

func getTableKey(tableName string) string {
	switch tableName {
	case "events_attributes":
		return "events_attributes.event_id"
	case "events":
		return "events.id"
	case "links_attributes":
		return "links_attributes.link_id"
	case "links":
		return "links.id"
	case "resource_attributes":
		return "resource_attributes.resource_id"
	case "scope_attributes":
		return "scope_attributes.scope_id"
	case "scopes":
		return "scopes.id"
	case "span_attributes":
		return "span_attributes.span_id"
	case "spans":
		return "spans.span_id"
	default:
		return "*"
	}
}

func buildTagValuesQuery(r tagsquery.TagValuesRequest, tag string) (string, error) {
	tableQueryMap := make(map[string][]string)
	prepareSqliteFilter, err := newSqliteFilter(tag)
	if err != nil {
		return "", fmt.Errorf("illegal tag name: %s", tag)
	}
	tableName := prepareSqliteFilter.getTableName()
	godTableName := prepareSqliteFilter.getTableName()
	var godField string
	var subQuery string
	var godCondition string
	if prepareSqliteFilter.isDynamicTable() {
		subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s = '%s'", getTableKey(tableName), tableName, tableName+".key", prepareSqliteFilter.getTag())
		godField = tableName + ".value"
		godCondition = fmt.Sprintf("WHERE %s = '%s'", tableName+".key", prepareSqliteFilter.getTag())
	} else {
		mappedTag := sqliteFieldsMap[tag]
		subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s IS NOT NULL", getTableKey(tableName), tableName, mappedTag)
		godField = mappedTag
		godCondition = fmt.Sprintf("WHERE %s IS NOT NULL", mappedTag)
	}
	if value, ok := tableQueryMap[tableName]; ok {
		tableQueryMap[tableName] = append(value, subQuery)
	} else {
		tableQueryMap[tableName] = []string{subQuery}
	}
	var filters []model.SearchFilter
	if r.Timeframe != nil {
		filters = append(filters, createTimeframeFilters(*r.Timeframe)...)
	}
	filters = append(filters, convertFiltersValues(r.SearchFilters)...)
	if len(filters) > 0 {
		for _, filter := range filters {
			prepareSqliteFilter, err = newSqliteFilter(string(filter.KeyValueFilter.Key))
			if err != nil {
				return "", fmt.Errorf("illegal tag name: %s", filter.KeyValueFilter.Key)
			}
			tableName := prepareSqliteFilter.getTableName()
			var subQuery string
			if prepareSqliteFilter.isDynamicTable() {
				key := fmt.Sprintf("%s.%s", prepareSqliteFilter.getTableName(), prepareSqliteFilter.getTag())
				operator := filter.KeyValueFilter.Operator
				value := filter.KeyValueFilter.Value
				subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s", getTableKey(tableName), tableName, covertFilterToSqliteQuery(newSearchFilter(key, operator, value)))
			} else {
				key := sqliteFieldsMap[string(filter.KeyValueFilter.Key)]
				operator := filter.KeyValueFilter.Operator
				value := filter.KeyValueFilter.Value
				subQuery = fmt.Sprintf("SELECT %s FROM %s WHERE %s", getTableKey(tableName), tableName, covertFilterToSqliteQuery(newSearchFilter(key, operator, value)))
			}
			if value, ok := tableQueryMap[tableName]; ok {
				tableQueryMap[tableName] = append(value, subQuery)
			} else {
				tableQueryMap[tableName] = []string{subQuery}
			}
		}
	}
	intersectedQueriesMap := make(map[string]string)
	for tableName, queries := range tableQueryMap {
		intersectedQueriesMap[tableName] = strings.Join(queries, " INTERSECT ")
	}
	joinedQueriesMap := make(map[string]string)
	for tableName, query := range intersectedQueriesMap {
		sq := joinRelatedTables(tableName, query)
		joinedQueriesMap[tableName] = sq
	}
	subQuery = fmt.Sprintf("SELECT %s FROM (%s) %s", getTableKey(godTableName), joinedQueriesMap[godTableName], godTableName)
	for tableName, joinQuery := range joinedQueriesMap {
		if tableName == godTableName {
			continue
		}
		subQuery = fmt.Sprintf("%s JOIN (%s) %s ON %s.span_id = %s.span_id", subQuery, joinQuery, tableName, godTableName, tableName)
	}
	tableKey := strings.Split(getTableKey(godTableName), ".")[1]
	query := fmt.Sprintf("WITH subQuery AS (%s) SELECT %s, COUNT(*) FROM %s JOIN subQuery ON %s.%s = subQuery.%s %s GROUP BY %s", subQuery, godField, godTableName, godTableName, tableKey, tableKey, godCondition, godField)
	return query, nil
}

func buildDynamicTagsQuery() string {
	var queries []string
	for tableKey, table := range sqliteTableNameMap {
		if isDynamicTagsTable(table) && tableKey != "span.resource.attributes" {
			queries = append(queries, fmt.Sprintf("SELECT DISTINCT '%s' as table_key, t.key as tag_name, t.type as tag_type FROM %s t", tableKey, table))
		}
	}
	return strings.Join(queries, " UNION ALL ")
}
