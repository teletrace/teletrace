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

package searchcontroller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"oss-tracing/plugin/spanreader/es/errors"
	spanreaderes "oss-tracing/plugin/spanreader/es/utils"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"

	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/sortorder"
	"github.com/mitchellh/mapstructure"
	"go.uber.org/zap"
)

type searchController struct {
	client *elasticsearch.TypedClient
	idx    string
}

func NewSearchController(logger *zap.Logger, client *elasticsearch.TypedClient, idx string) (*searchController, error) {
	return &searchController{client: client, idx: idx}, nil
}

func (sc *searchController) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	var err error

	req, err := buildSearchRequest(r)

	if err != nil {
		return nil, fmt.Errorf("Could not build search request: %+v", err)
	}

	searchAPI := sc.client.API.Search()
	res, err := searchAPI.Request(req).Index(sc.idx).Do(ctx)

	if err != nil {
		return nil, fmt.Errorf("Could not search spans: %+v", err)
	}

	defer res.Body.Close()

	body, err := decodeResponse(res)

	if err != nil {
		switch err := err.(type) {
		case *errors.ElasticSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return &spansquery.SearchResponse{}, nil
			}
		default:
			return nil, fmt.Errorf("could not search spans: %+v", err)
		}
	}

	searchResp, err := parseSpansResponse(body)

	if err != nil {
		return nil, fmt.Errorf("Could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func buildSearchRequest(r spansquery.SearchRequest) (*search.Request, error) {
	var err error

	builder := search.NewRequestBuilder()

	timeframeFilters := spanreaderes.CreateTimeframeFilters(r.Timeframe)

	filters := append(r.SearchFilters, timeframeFilters...)

	if builder, err = spanreaderes.BuildQuery(builder, filters...); err != nil {
		return nil, fmt.Errorf("Could not build query for search request: %+v. err: %+v", r, err)
	}

	builder = buildSort(builder, r.Sort...)
	if r.Metadata != nil && r.Metadata.NextToken != "" {
		sortResults := types.SortResults{string(r.Metadata.NextToken)}
		sortResultsBuilder := types.NewSortResultsBuilder().SortResults(sortResults)
		builder = builder.SearchAfter(sortResultsBuilder)
	}

	builder = builder.Size(200) // Where to get this number from?

	return builder.Build(), nil
}

func buildSort(b *search.RequestBuilder, s ...spansquery.Sort) *search.RequestBuilder {
	DIRECTION := map[bool]sortorder.SortOrder{true: sortorder.Asc, false: sortorder.Desc}

	sorts := []types.SortCombinations{}
	for _, _s := range s {
		sorts = append(sorts, types.NewSortCombinationsBuilder().
			Field(types.Field(_s.Field)).
			SortOptions(types.NewSortOptionsBuilder().
				SortOptions(map[types.Field]*types.FieldSortBuilder{
					types.Field(_s.Field): types.NewFieldSortBuilder().Order(DIRECTION[_s.Ascending]),
				}),
			).
			Build(),
		)
	}
	return b.Sort(types.NewSortBuilder().Sort(sorts))

}

func decodeResponse(res *http.Response) (map[string]any, error) {
	// check errors
	var err error
	var body map[string]any
	if err = json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	if res.StatusCode >= 400 {
		esError, err := errors.ESErrorFromHttpResponse(res.Status, body)
		if err != nil {
			return nil, err
		}
		return nil, esError
	}
	return body, nil
}

func parseSpansResponse(body map[string]any) (*spansquery.SearchResponse, error) {
	var err error

	hits := body["hits"].(map[string]any)["hits"].([]any)

	spans := []*internalspan.InternalSpan{}
	for _, h := range hits {
		hit := h.(map[string]any)["_source"].(map[string]any)
		var s internalspan.InternalSpan
		err = mapstructure.Decode(hit, &s)
		if err != nil {
			return nil, fmt.Errorf("Could not decode response hit from elasticsearch: %+v", err)
		}
		spans = append(spans, &s)
	}

	var metadata *spansquery.Metadata
	if len(hits) > 0 {
		metadata = &spansquery.Metadata{}
		if err := extractNextToken(hits, metadata); err != nil {
			return nil, err
		}
	}

	return &spansquery.SearchResponse{
		Spans:    spans,
		Metadata: metadata,
	}, nil
}

func extractNextToken(hits []any, metadata *spansquery.Metadata) error {
	if sort := hits[len(hits)-1].(map[string]any)["sort"]; sort != nil {
		sort := sort.([]any)
		if len(sort) > 0 {
			if len(sort) > 1 {
				return fmt.Errorf(
					"expected a single sort field, but found: %v", len(sort))
			}

			switch sortField := sort[0].(type) {
			case string:
				metadata.NextToken = spansquery.ContinuationToken(sortField)
			default:
				return fmt.Errorf(
					"expected a sort field of type string, but found: %v", sortField)
			}
		}
	}

	return nil
}
