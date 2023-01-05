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
	"oss-tracing/pkg/model/tagsquery/v1"
	"strings"

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
	if r.Metadata != nil && r.Metadata.NextToken != "" {
		extractOrderResponse, err := extractNextToken(r.Sort, r.Metadata.NextToken)
		if err != nil {
			return nil, fmt.Errorf("failed to extract next token: %v", err)
		}
		searchQueryResponse.sort = extractOrderResponse.sortTag
		err = queryBuilder.addFilter(extractOrderResponse.filter)
		if err != nil {
			return nil, fmt.Errorf("failed to add filter from order: %v", err)
		}
	}
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
	withQuery := fmt.Sprintf("WITH initial_query as (SELECT spans.span_id, spans.instrumentation_scope_id FROM %s %s %s LIMIT %d)", queryBuilder.buildTables(), queryParams.filters, queryParams.orders, LimitOfSpanRecords)
	searchQueryResponse.query = fmt.Sprintf(withQuery+
		"SELECT iq.span_id, spans.trace_id, spans.trace_state, spans.parent_span_id, spans.name, spans.kind, spans.start_time_unix_nano, "+
		"spans.end_time_unix_nano, spans.dropped_span_attributes_count, spans.span_status_message, spans.span_status_code, "+
		"spans.dropped_resource_attributes_count, spans.dropped_events_count, spans.dropped_links_count, spans.duration, spans.ingestion_time_unix_nano, span_attributes, "+
		"scopes.name, scopes.version, scopes.dropped_attributes_count, scope_attributes, "+
		"events, links, resources "+
		"FROM initial_query AS iq "+
		"JOIN spans ON spans.span_id = iq.span_id "+
		"LEFT JOIN "+
		"(SELECT span_resource_attributes.span_id, json_group_array(json_object('key', span_resource_attributes.key, 'value', span_resource_attributes.value, 'type', span_resource_attributes.type)) "+
		"AS resources "+
		"FROM (SELECT * FROM resource_attributes JOIN span_resource_attributes "+
		"AS sr ON resource_attributes.resource_id = sr.resource_attribute_id) "+
		"AS span_resource_attributes "+
		"GROUP BY span_resource_attributes.span_id) "+
		"AS resource_attributes "+
		"ON resource_attributes.span_id = iq.span_id "+
		"LEFT JOIN "+
		"(SELECT span_attributes.span_id, json_group_array(json_object('key', span_attributes.key, 'value', span_attributes.value, 'type', span_attributes.type)) "+
		"AS span_attributes FROM span_attributes GROUP BY span_attributes.span_id) "+
		"AS span_attributes ON iq.span_id = span_attributes.span_id "+
		"LEFT JOIN "+
		"(SELECT scope_attributes.id, scope_attributes.name, scope_attributes.version, scope_attributes.dropped_attributes_count, scope_attributes.scope_attributes  "+
		"FROM (SELECT scopes.id, scopes.name, scopes.version, scopes.dropped_attributes_count, json_group_array(json_object('key', sa.key, 'value', sa.value, 'type', sa.type)) "+
		"AS scope_attributes FROM scopes "+
		"JOIN scope_attributes AS sa ON scopes.id = sa.scope_id) "+
		"AS scope_attributes GROUP BY scope_attributes.id) "+
		"AS scopes ON scopes.id = iq.instrumentation_scope_id "+
		"LEFT JOIN "+
		"(SELECT events.span_id, json_group_array(json_object('time_unix_nano', events.time_unix_nano, 'name', events.name, 'dropped_attributes_count', events.dropped_attributes_count, 'event_attributes', events.event_attributes)) "+
		"AS events "+
		"FROM "+
		"(SELECT events.span_id, events.time_unix_nano, events.name, events.dropped_attributes_count, json_group_array(json_object('key', ea.key, 'value', ea.value)) "+
		"AS event_attributes FROM events JOIN event_attributes ea ON events.id = ea.event_id GROUP BY events.id) "+
		"AS events GROUP BY events.span_id) "+
		"AS events ON events.span_id = iq.span_id "+
		"LEFT JOIN "+
		"(SELECT links.span_id, json_group_array(json_object('trace_state', links.trace_state, 'name', links.dropped_attributes_count, 'link_attributes', links.link_attributes)) "+
		"AS links "+
		"FROM "+
		"(SELECT links.span_id, links.trace_state, links.dropped_attributes_count,  json_group_array(json_object('key', la.key, 'value', la.value)) "+
		"AS link_attributes FROM links "+
		"JOIN link_attributes la ON links.id = la.link_id GROUP BY links.id) "+
		"AS links GROUP BY links.span_id) "+
		"AS links ON links.span_id = iq.span_id "+
		"GROUP BY iq.span_id;",
		queryParams.filters, queryParams.orders, LimitOfSpanRecords)
	return searchQueryResponse, nil
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

func buildTagValuesQuery(r tagsquery.TagValuesRequest, tag string) (string, error) {
	prepareSqliteFilter, err := newSqliteFilter(tag)
	if err != nil {
		return "", fmt.Errorf("illegal tag name: %s", tag)
	}
	queryBuilder := newQueryBuilder()
	var filters []model.SearchFilter
	if r.Timeframe != nil {
		filters = append(filters, createTimeframeFilters(*r.Timeframe)...)
	}
	filters = append(filters, convertFiltersValues(r.SearchFilters)...)
	err = queryBuilder.addFilters(filters)
	if err != nil {
		return "", err
	}
	queryBuilder.addTable(prepareSqliteFilter.getTableName())
	if prepareSqliteFilter.isDynamicTable() {
		queryBuilder.addDynamicTagValueField(prepareSqliteFilter.getTableName())
		err := queryBuilder.addNewDynamicTagFilter(prepareSqliteFilter.getTableKey(), prepareSqliteFilter.getTag())
		if err != nil {
			return "", fmt.Errorf("illegal tag name: %s", tag)
		}
	} else {
		if field, ok := sqliteFieldsMap[tag]; ok {
			queryBuilder.addField(field)
		} else {
			return "", fmt.Errorf("illegal tag name: %s", tag)
		}
	}
	queryParams, err := queryBuilder.buildQueryParams()
	if err != nil {
		return "", fmt.Errorf("failed to build query params: %v", err)
	}
	if queryParams.filters != "" { // add WHERE clause if there are filters
		queryParams.filters = fmt.Sprintf("WHERE %s", queryParams.filters)
	}
	return fmt.Sprintf("SELECT %s, COUNT(*) FROM %s %s GROUP BY %s", queryParams.fields, queryParams.tables, queryParams.filters, queryParams.fields), nil
}

func buildDynamicTagsQuery() string {
	var queries []string
	for tableKey, table := range sqliteTableNameMap {
		if isDynamicTagsTable(table) {
			queries = append(queries, fmt.Sprintf("SELECT DISTINCT '%s' as table_key, t.key as tag_name, t.type as tag_type FROM %s t", tableKey, table))
		}
	}
	return strings.Join(queries, " UNION ALL ")
}
