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

package sqlite

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"
)

type spanReader struct {
	cfg    SqliteConfig
	logger *zap.Logger
	ctx    context.Context
	client sqliteClient
}

func (sr *spanReader) Initialize() error {
	return nil
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return nil, nil
}

func (sr *spanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return nil, nil
}

func (sr *spanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader(ctx context.Context, logger *zap.Logger, cfg SqliteConfig) (spanreader.SpanReader, error) {
	errMsg := "cannot create a new span reader for sqlite: %w"

	client, err := newSqliteClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return &spanReader{
		cfg:    cfg,
		logger: logger,
		ctx:    ctx,
		client: *client,
	}, nil
}
