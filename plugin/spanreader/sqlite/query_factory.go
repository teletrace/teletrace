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
	LIMIT = 200
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
		for _, order := range queryBuilder.getOrders() {
			prepareOrder, err := newSqliteOrder(order)
			if err != nil {
				return nil, fmt.Errorf("failed to parse order: %v", err)
			}
			searchQueryResponse.sort = prepareOrder.getTag()
			switch prepareOrder.orderBy {
			case "DESC":
				err := queryBuilder.addFilter(newSearchFilter(fmt.Sprintf("%s.%s", prepareOrder.getTableKey(), prepareOrder.getTag()), spansquery.OPERATOR_LT, r.Metadata.NextToken))
				if err != nil {
					return nil, fmt.Errorf("failed to add filter from order: %v", err)
				}
			case "ASC":
				err := queryBuilder.addFilter(newSearchFilter(fmt.Sprintf("%s.%s", prepareOrder.getTableKey(), prepareOrder.getTag()), spansquery.OPERATOR_GT, r.Metadata.NextToken))
				if err != nil {
					return nil, fmt.Errorf("failed to add filter from order: %v", err)
				}
			}
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
	searchQueryResponse.query = fmt.Sprintf("SELECT spans.span_id, spans.trace_id, spans.trace_state, spans.parent_span_id, spans.name, spans.kind, spans.start_time_unix_nano, spans.end_time_unix_nano, spans.dropped_span_attributes_count, spans.span_status_message, spans.span_status_code, spans.dropped_resource_attributes_count, spans.dropped_events_count, spans.dropped_links_count, spans.duration, spans.ingestion_time_unix_nano, span_attributes ,scopes.name, scopes.version, scopes.dropped_attributes_count, scope_attributes, events.time_unix_nano, events.name, events.dropped_attributes_count, event_attributes, links.trace_state, links.dropped_attributes_count, link_attributes, resource_attributes from spans left join (select span_attributes.span_id, json_group_array(json_object('key', span_attributes.key, 'value', span_attributes.value, 'type', span_attributes.type)) as span_attributes from span_attributes group by span_attributes.span_id) as span_attributes on spans.span_id = span_attributes.span_id left join (select scopes.id ,scopes.name, scopes.version, scopes.dropped_attributes_count from scopes) as scopes on spans.instrumentation_scope_id = scopes.id left join (select scope_attributes.scope_id, json_group_array(json_object('key', scope_attributes.key, 'value', scope_attributes.value, 'type', scope_attributes.type)) as scope_attributes from scope_attributes group by scope_attributes.scope_id) as scope_attributes on scopes.id = scope_attributes.scope_id left join (select  events.id, events.span_id, events.time_unix_nano, events.name, events.dropped_attributes_count from events) as events on spans.span_id = events.span_id left join (select event_attributes.event_id, json_group_array(json_object('key', event_attributes.key, 'value', event_attributes.value)) as event_attributes from event_attributes group by event_attributes.event_id) as event_attributes on events.id = event_attributes.event_id left join (select links.id, links.span_id, links.trace_state, links.dropped_attributes_count from links) as links on spans.span_id = links.span_id left join (select link_attributes.link_id, json_group_array(json_object('key', link_attributes.key, 'value', link_attributes.value)) as link_attributes from link_attributes group by link_attributes.link_id) as link_attributes on links.id = link_attributes.link_id left join (select resource_attributes.resource_id, json_group_array(json_object('key', resource_attributes.key, 'value', resource_attributes.value, 'type', resource_attributes.type)) as resource_attributes from resource_attributes group by resource_attributes.resource_id) as resource_attributes on spans.resource_id = resource_attributes.resource_id %s %s limit %d;", queryParams.filters, queryParams.orders, LIMIT)
	return searchQueryResponse, nil
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
