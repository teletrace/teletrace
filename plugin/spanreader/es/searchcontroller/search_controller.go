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

package searchcontroller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"oss-tracing/plugin/spanreader/es/errors"
	spanreaderes "oss-tracing/plugin/spanreader/es/utils"

	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/sortorder"
	"go.uber.org/zap"
)

const TieBreakerField = "span.spanId.keyword"

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

	searchResp, err := parseSpansResponse(body, withMiliSecTimestampAsNanoSec())
	if err != nil {
		return nil, fmt.Errorf("Could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func buildSearchRequest(r spansquery.SearchRequest) (*search.Request, error) {
	var err error

	builder := search.NewRequestBuilder()

	timeframeFilters := spanreaderes.CreateTimeframeFilters(&r.Timeframe)

	filters := append(r.SearchFilters, timeframeFilters...)

	if builder, err = spanreaderes.BuildQuery(builder, filters...); err != nil {
		return nil, fmt.Errorf("Could not build query for search request: %+v. err: %+v", r, err)
	}

	builder = buildSort(builder, r.Sort...)
	if r.Metadata != nil && r.Metadata.NextToken != "" {
		var sortKeys []string
		if err := json.Unmarshal([]byte(r.Metadata.NextToken), &sortKeys); err != nil {
			return nil, err
		}
		sortResultsBuilder := types.NewSortResultsBuilder().SortResults(sortKeys)
		builder = builder.SearchAfter(sortResultsBuilder)
	}

	builder = builder.Size(50) // Where to get this number from?

	return builder.Build(), nil
}

func addSortField(fieldName spansquery.SortField, ascending bool, sorts []types.SortCombinations) []types.SortCombinations {
	DIRECTION := map[bool]sortorder.SortOrder{true: sortorder.Asc, false: sortorder.Desc}

	return append(sorts, types.NewSortCombinationsBuilder().
		Field(types.Field(fieldName)).
		SortOptions(types.NewSortOptionsBuilder().
			SortOptions(map[types.Field]*types.FieldSortBuilder{
				types.Field(fieldName): types.NewFieldSortBuilder().Order(DIRECTION[ascending]),
			}),
		).
		Build(),
	)
}

func buildSort(b *search.RequestBuilder, s ...spansquery.Sort) *search.RequestBuilder {
	sorts := []types.SortCombinations{}
	tieBreakerFound := false
	for _, _s := range s {
		if _s.Field == TieBreakerField {
			tieBreakerFound = true
		}
		sorts = addSortField(_s.Field, _s.Ascending, sorts)
	}
	if !tieBreakerFound {
		sorts = addSortField(TieBreakerField, true, sorts)
	}
	return b.Sort(types.NewSortBuilder().Sort(sorts))
}

func decodeResponse(res *http.Response) (map[string]any, error) {
	// check errors
	var err error
	var body map[string]any
	decoder := json.NewDecoder(res.Body)
	decoder.UseNumber()
	if err = decoder.Decode(&body); err != nil {
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
