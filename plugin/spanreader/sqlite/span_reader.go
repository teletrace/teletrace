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
	"context"
	"fmt"
	"oss-tracing/pkg/model/metadata/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"

	"go.uber.org/zap"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type spanReader struct {
	cfg    SqliteConfig
	logger *zap.Logger
	ctx    context.Context
	client *sqliteClient
}

func (sr *spanReader) Initialize() error {
	return nil
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	var result spansquery.SearchResponse
	result.Spans = make([]*internalspan.InternalSpan, 0) // can't be nil
	searchQueryResponse, err := buildSearchQuery(r)
	if err != nil {
		return nil, err
	}
	stmt, err := sr.client.db.PrepareContext(ctx, searchQueryResponse.query)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %v", err)
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query spans: %v", err)
	}
	defer rows.Close()
	var nextToken spansquery.ContinuationToken
	for rows.Next() {
		sqliteSpan := newSqliteInternalSpan()
		err = rows.Scan(
			&sqliteSpan.spanId,
			&sqliteSpan.traceId,
			&sqliteSpan.traceState,
			&sqliteSpan.parentSpanId,
			&sqliteSpan.spanName,
			&sqliteSpan.spanKind,
			&sqliteSpan.startTimeUnixNano,
			&sqliteSpan.endTimeUnixNano,
			&sqliteSpan.droppedSpanAttributesCount,
			&sqliteSpan.statusMessage,
			&sqliteSpan.statusCode,
			&sqliteSpan.resourceDroppedAttributesCount,
			&sqliteSpan.droppedEventsCount,
			&sqliteSpan.droppedLinksCount,
			&sqliteSpan.durationNano,
			&sqliteSpan.ingestionTimeUnixNano,
			&sqliteSpan.spanAttributes,
			&sqliteSpan.scopeName,
			&sqliteSpan.scopeVersion,
			&sqliteSpan.scopeDroppedAttributesCount,
			&sqliteSpan.scopeAttributes,
			&sqliteSpan.eventsAttributes,
			&sqliteSpan.linksAttributes,
			&sqliteSpan.resourceAttributes,
		)
		if err != nil {
			sr.logger.Error("failed to get span value", zap.Error(err))
			continue
		}
		internalSpan, err := sqliteSpan.toInternalSpan()
		if err != nil {
			sr.logger.Error("failed to convert span", zap.Error(err))
			continue
		}
		result.Spans = append(result.Spans, internalSpan)

	}
	if len(result.Spans) > 0 {
		lastInternalSpanIndex := len(result.Spans) - 1
		lastInternalSpan := result.Spans[lastInternalSpanIndex]
		if lastInternalSpan != nil {
			switch searchQueryResponse.sort {
			case "duration":
				nextToken = spansquery.ContinuationToken(fmt.Sprintf("%d", lastInternalSpan.ExternalFields.DurationNano))
			default:
				nextToken = spansquery.ContinuationToken(fmt.Sprintf("%d", lastInternalSpan.Span.StartTimeUnixNano))
			}
			result.Metadata = &spansquery.Metadata{
				NextToken: nextToken,
			}
		}
	}
	return &result, nil
}

func (sr *spanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	var tags tagsquery.GetAvailableTagsResponse
	tag := tagsquery.TagInfo{}
	for tagName, fieldType := range staticTagTypeMap {
		tag.Name = tagName
		tag.Type = fieldType
		tags.Tags = append(tags.Tags, tag)
	}
	query := buildDynamicTagsQuery()

	stmt, err := sr.client.db.PrepareContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %v", err)
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query tags: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var tableKey, tagName, tagType string
		err = rows.Scan(&tableKey, &tagName, &tagType)
		if err != nil {
			sr.logger.Error("failed to get tag value", zap.Error(err))
			continue
		}
		tag.Name = fmt.Sprintf("%s.%s", tableKey, tagName)
		tag.Type = tagType
		tags.Tags = append(tags.Tags, tag)
	}
	return &tags, nil
}

func (sr *spanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	result := make(map[string]*tagsquery.TagValuesResponse)
	for _, tag := range tags {
		tagValueResponse, err := sr.GetTagValues(ctx, r, tag)
		if err != nil {
			sr.logger.Error("failed to get tag value", zap.Error(err))
			continue
		}
		result[tag] = tagValueResponse
	}
	return result, nil
}

func (sr *spanReader) GetTagValues(ctx context.Context, r tagsquery.TagValuesRequest, tag string) (*tagsquery.TagValuesResponse, error) {
	var currentTagValues []tagsquery.TagValueInfo
	query, err := buildTagValuesQuery(r, tag)
	if err != nil {
		sr.logger.Error("failed to build tag values query for: "+tag, zap.Error(err))
		return nil, err
	}
	stmt, err := sr.client.db.PrepareContext(ctx, query)
	if err != nil {
		sr.logger.Error("failed to prepare query: "+query, zap.Error(err))
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		sr.logger.Error("failed to query tags values for: "+tag, zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var name any
		var count int
		err = rows.Scan(&name, &count)
		if err != nil {
			sr.logger.Error("failed to get tag value", zap.Error(err))
			continue
		}
		if name == nil {
			continue
		}
		currentTagValues = append(currentTagValues, tagsquery.TagValueInfo{
			Value: name,
			Count: count,
		})
	}

	return &tagsquery.TagValuesResponse{
		Values: currentTagValues,
	}, nil
}

func (sr *spanReader) GetSystemId(ctx context.Context, r metadata.GetSystemIdRequest) (*metadata.GetSystemIdResponse, error) {
	return nil, fmt.Errorf("Not implemented method")
}

func (sr *spanReader) SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	return nil, fmt.Errorf("Not implemented method")
}

func (sr *spanReader) GetTagsStatistics(ctx context.Context, r tagsquery.TagStatisticsRequest) (*tagsquery.TagStatisticsResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader(ctx context.Context, logger *zap.Logger, cfg SqliteConfig) (spanreader.SpanReader, error) {
	client, err := newSqliteClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf("cannot create a new span reader for sqlite: %w", err)
	}

	return &spanReader{
		cfg:    cfg,
		logger: logger,
		ctx:    ctx,
		client: client,
	}, nil
}
