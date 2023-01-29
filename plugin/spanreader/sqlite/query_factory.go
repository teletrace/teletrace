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

func buildSearchQuery(r spansquery.SearchRequest) (*searchQueryResponse, error) { // create a query string from the request
	searchQueryResponse := newSearchQueryResponse()
	extractedNextToken, err := extractNextToken(r.Sort, r.Metadata.NextToken)
	if err != nil {
		return nil, fmt.Errorf("failed to extract next token: %v", err)
	}
	filters := createTimeframeFilters(r.Timeframe)
	filters = append(filters, convertFiltersValues(r.SearchFilters)...)
	orderFilter := extractedNextToken.getFilter()
	if orderFilter.KeyValueFilter != nil {
		filters = append(filters, orderFilter)
	}
	subQueryBuilder := newSubQueryBuilder("spans")
	err = subQueryBuilder.addFiltersToSubQuery(filters)
	if err != nil {
		return nil, fmt.Errorf("failed to add filters: %v", err)
	}
	err = subQueryBuilder.intersectQueriesMap()
	if err != nil {
		return nil, fmt.Errorf("failed to intersect queries: %v", err)
	}

	err = subQueryBuilder.joinQueriesMap()
	if err != nil {
		return nil, fmt.Errorf("failed to join queries: %v", err)
	}
	subQuery, err := subQueryBuilder.getSubQuery()
	if err != nil {
		return nil, fmt.Errorf("failed to get sub query: %v", err)
	}
	order := fmt.Sprintf(" ORDER BY %s %s ", extractedNextToken.getSortTag(), extractedNextToken.getSortBy())
	searchQueryResponse.query = getSearchQuery(subQuery, order)
	return searchQueryResponse, nil
}

func getSearchQuery(subQuery string, orders string) string {
	spanIdentifiersQuery := fmt.Sprintf("WITH initial_query as (%s)", subQuery) // base query for search query
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

func buildTagValuesQuery(r tagsquery.TagValuesRequest, tag string) (*tagValueQueryResponse, error) {
	prepareSqliteFilter, err := newSqliteFilter(tag)
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: illegal tag name: %s", tag)
	}
	subQueryBuilder := newSubQueryBuilder(prepareSqliteFilter.getTableName())
	err = subQueryBuilder.initTagsQuery(prepareSqliteFilter, tag)
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: %w", err)
	}
	var filters []model.SearchFilter
	if r.Timeframe != nil {
		filters = append(filters, createTimeframeFilters(*r.Timeframe)...)
	}
	filters = append(filters, convertFiltersValues(r.SearchFilters)...)

	err = subQueryBuilder.addFiltersToSubQuery(filters)
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: %w", err)
	}
	err = subQueryBuilder.intersectQueriesMap()
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: %w", err)
	}
	err = subQueryBuilder.joinQueriesMap()
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: %w", err)
	}
	subQuery, err := subQueryBuilder.getSubQuery()
	if err != nil {
		return nil, fmt.Errorf("buildTagValuesQuery: %w", err)
	}
	mainTableName := subQueryBuilder.getMainTableName()
	tableKey := tableJoinKeyMap[mainTableName]
	mainField := subQueryBuilder.getMainField()
	mainCondition := subQueryBuilder.getMainCondition()
	query := fmt.Sprintf("WITH subQuery AS (%s) SELECT %s, COUNT(*) FROM %s JOIN subQuery ON %s.%s = subQuery.%s %s GROUP BY %s", subQuery, mainField, mainTableName, mainTableName, tableKey, tableKey, mainCondition, mainField)
	tagValueQueryResponse := newTagValueQueryResponse(query)
	return tagValueQueryResponse, nil
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
