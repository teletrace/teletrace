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
    // sr.convertFilterKeysToKeywords(r.SearchFilters)
    // sr.optimizeSort(r.Sort)

    res, err := sr.dslController.Search(ctx, r)
    if err != nil {
        return nil, fmt.Errorf("Could not search documents: %+v", err)
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
    return nil, nil
}

func (sr *spanReader) GetTagsValues(
    ctx context.Context, r tagsquery.TagValuesRequest, tags []string,
) (map[string]*tagsquery.TagValuesResponse, error) {
    return nil, nil
}

func (sr *spanReader) GetTagsStatistics(ctx context.Context, r tagsquery.TagStatisticsRequest, tag string) (*tagsquery.TagStatisticsResponse, error) {
    return nil, nil
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
    return nil, nil
}

func (sr *spanReader) SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
    return nil, nil
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
