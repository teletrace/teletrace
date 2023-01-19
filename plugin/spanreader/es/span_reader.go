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

package spanreaderes

import (
	"context"
	"fmt"
	"oss-tracing/pkg/model"
	"oss-tracing/pkg/model/metadata/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"
	"oss-tracing/plugin/spanreader/es/metadatacontroller"
	"oss-tracing/plugin/spanreader/es/searchcontroller"
	"oss-tracing/plugin/spanreader/es/tagscontroller"

	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"go.uber.org/zap"
)

const spanIdField = "span.spanId"

type spanReader struct {
	cfg                ElasticConfig
	logger             *zap.Logger
	ctx                context.Context
	searchController   searchcontroller.SearchController
	tagsController     tagscontroller.TagsController
	metadataController metadatacontroller.MetadataController
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	if r.Sort == nil || len(r.Sort) == 0 {
		r.Sort = []spansquery.Sort{{Field: spanIdField, Ascending: true}}
	}
	sr.convertFilterKeysToKeywords(r.SearchFilters)
	sr.optimizeSort(r.Sort)

	res, err := sr.searchController.Search(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("Could not index document: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) optimizeSort(s []spansquery.Sort) {
	for i, sort := range s {
		if sort.Field == spanIdField {
			// Mapping span id field to Elasticsearch 'keyword' which offers better performance
			s[i].Field = spansquery.SortField(fmt.Sprintf("%s.keyword", sort.Field))
		}
	}
}

func (sr *spanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	res, err := sr.tagsController.GetAvailableTags(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("GetAvailableTags failed with error: %+v", err)
	}

	return &res, nil
}

func (sr *spanReader) GetTagsValues(
	ctx context.Context, r tagsquery.TagValuesRequest, tags []string,
) (map[string]*tagsquery.TagValuesResponse, error) {
	sr.convertFilterKeysToKeywords(r.SearchFilters)
	res, err := sr.tagsController.GetTagsValues(ctx, r, tags)
	if err != nil {
		return nil, fmt.Errorf("GetTagsValues failed with error: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) GetTagsStatistics(ctx context.Context, r *tagsquery.TagStatisticsRequest) (*tagsquery.TagStatisticsResponse, error) {
	res, err := sr.tagsController.GetTagsStatistics(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("GetTagsValues failed with error: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) convertFilterKeysToKeywords(filters []model.SearchFilter) {
	// Converting every filter key to Elasticsearch 'keyword' which guarantees that the string will be a single token
	for _, f := range filters {
		switch f.KeyValueFilter.Value.(type) {
		case string:
			f.KeyValueFilter.Key = model.FilterKey(fmt.Sprintf("%s.keyword", f.KeyValueFilter.Key))
		}
	}
}

func (sr *spanReader) GetSystemId(ctx context.Context, r metadata.GetSystemIdRequest) (*metadata.GetSystemIdResponse, error) {
	res, err := sr.metadataController.GetSystemId(ctx)
	if err != nil {
		return nil, fmt.Errorf("GetSystemId failed with error: %+v", err)
	}
	return res, nil
}

func (sr *spanReader) SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	res, err := sr.metadataController.SetSystemId(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("GetSystemId failed with error: %+v", err)
	}
	return res, nil
}

func (sr *spanReader) Initialize() error {
	// This method may be implemented for other databases, not needed in ES.
	return nil
}

func NewSpanReader(ctx context.Context, logger *zap.Logger, elasticSpansCfg ElasticConfig, elasticMetaCfg ElasticConfig) (spanreader.SpanReader, error) {
	errMsg := "cannot create a new span reader: %w"

	rawClient, err := newRawClient(logger, elasticSpansCfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	typedClient, err := newTypedClient(logger, elasticSpansCfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	sc, err := searchcontroller.NewSearchController(logger, typedClient, elasticSpansCfg.Index)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	tc, err := tagscontroller.NewTagsController(logger, rawClient, typedClient, elasticSpansCfg.Index)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	metaTypedClient, err := newTypedClient(logger, elasticMetaCfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}
	mc, err := metadatacontroller.NewMetadataController(logger, metaTypedClient, elasticMetaCfg.Index)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return &spanReader{
		cfg:                elasticSpansCfg,
		logger:             logger,
		ctx:                ctx,
		searchController:   sc,
		tagsController:     tc,
		metadataController: mc,
	}, nil
}
