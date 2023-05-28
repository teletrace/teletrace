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

package spanreaderos

import (
	"context"
	"fmt"

	"github.com/teletrace/teletrace/pkg/model"

	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"github.com/teletrace/teletrace/pkg/spanreader"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/dslquerycontroller"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/querycontroller"
	"go.uber.org/zap"
)

const spanIdField = "span.spanId"

type spanReader struct {
	cfg           OpenSearchConfig
	logger        *zap.Logger
	ctx           context.Context
	dslController querycontroller.QueryController
}

func (sr *spanReader) Initialize() error {
	// This method may be implemented for other databases, not needed in ES.
	return nil
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	if r.Sort == nil || len(r.Sort) == 0 {
		r.Sort = []spansquery.Sort{{Field: spanIdField, Ascending: true}}
	}
	sr.convertFilterKeysToKeywords(r.SearchFilters)
	sr.optimizeSort(r.Sort)

	res, err := sr.dslController.Search(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("could not search documents: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) GetAvailableTags(ctx context.Context, req tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	res, err := sr.dslController.GetAvailableTags(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("could not get available tags: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) GetTagsValues(
	ctx context.Context, req tagsquery.TagValuesRequest, tags []string,
) (map[string]*tagsquery.TagValuesResponse, error) {
	res, err := sr.dslController.GetTagsValues(ctx, req, tags)
	if err != nil {
		return nil, fmt.Errorf("could not get tags values: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) GetTagsStatistics(ctx context.Context, req tagsquery.TagStatisticsRequest, tag string) (*tagsquery.TagStatisticsResponse, error) {
	res, err := sr.dslController.GetTagsStatistics(ctx, req, tag)
	if err != nil {
		return nil, fmt.Errorf("could not get tags statistics: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) GetSystemId(ctx context.Context, req metadata.GetSystemIdRequest) (*metadata.GetSystemIdResponse, error) {
	res, err := sr.dslController.GetSystemId(ctx)
	if err != nil {
		return nil, fmt.Errorf("could not get systemId: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) SetSystemId(ctx context.Context, req metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	res, err := sr.dslController.SetSystemId(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("could not set systemId: %+v", err)
	}

	return res, nil
}

func NewSpanReader(ctx context.Context, logger *zap.Logger, opensearchConfig OpenSearchConfig, opensearchMetaConfig OpenSearchConfig) (spanreader.SpanReader, error) {
	errMsg := "cannot create a new span reader: %w"

	client, err := newClient(logger, opensearchConfig)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	ctrl := dslquerycontroller.NewDslQueryController(logger, client, opensearchConfig.Index)

	return &spanReader{
		cfg:           opensearchConfig,
		logger:        logger,
		ctx:           ctx,
		dslController: ctrl,
	}, nil
}

func (sr *spanReader) convertFilterKeysToKeywords(filters []model.SearchFilter) {
	// Converting every filter key to opensearch 'keyword' which guarantees that the string will be a single token
	for _, f := range filters {
		switch f.KeyValueFilter.Value.(type) {
		case string:
			f.KeyValueFilter.Key = model.FilterKey(fmt.Sprintf("%s.keyword", f.KeyValueFilter.Key))
		}
	}
}

func (sr *spanReader) optimizeSort(s []spansquery.Sort) {
	for i, sort := range s {
		if sort.Field == spanIdField {
			// Mapping span id field to opensearch 'keyword' which offers better performance
			s[i].Field = spansquery.SortField(fmt.Sprintf("%s.keyword", sort.Field))
		}
	}
}
