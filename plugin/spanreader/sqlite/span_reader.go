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
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"

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
	_ = buildSearchQuery(r)
	return nil, nil
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
		var currentTagValues []tagsquery.TagValueInfo
		query, err := buildTagValuesQuery(r, tag)
		if err != nil {
			sr.logger.Error("failed to build tag values query for: "+tag, zap.Error(err))
			continue
		}
		rows, err := sr.client.db.QueryContext(ctx, query)
		if err != nil {
			sr.logger.Error("failed to query tags values for: "+tag, zap.Error(err))
			continue
		}
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
		result[tag] = &tagsquery.TagValuesResponse{
			Values: currentTagValues,
		}
	}
	return result, nil
}

func NewSqliteSpanReader(ctx context.Context, logger *zap.Logger, cfg config.Config) (spanreader.SpanReader, error) {
	errMsg := "cannot create a new span reader for sqlite: %w"
	sqliteConfig := NewSqliteConfig(cfg)
	client, err := newSqliteClient(logger, sqliteConfig)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return &spanReader{
		cfg:    sqliteConfig,
		logger: logger,
		ctx:    ctx,
		client: client,
	}, nil
}
