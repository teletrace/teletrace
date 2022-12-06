/**
 * Copyright 2022 Epsagon
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
	return nil, nil
}

func (sr *spanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
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
