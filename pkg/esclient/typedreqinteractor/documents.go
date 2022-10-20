package typedreqinteractor

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"oss-tracing/pkg/esclient/typedreqinteractor/querybuilder"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"strings"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/sortorder"
	"github.com/mitchellh/mapstructure"
)

func Search(ctx context.Context, c Client, idx string, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	var err error

	builder := search.NewRequestBuilder()

	builder, err = buildQuery(builder, r.SearchFilter...)
	if err != nil {
		return nil, fmt.Errorf("Could not build query for search request: %+v. err: %+v", r, err)
	}

	builder, err = buildSort(builder, r.Sort...)
	if err != nil {
		return nil, fmt.Errorf("Could not build sort for search request: %+v. err: %+v", r, err)
	}

	builder = builder.Size(200) // Where to get this number from?

	req := builder.Build()

	search := c.Client.API.Search()
	_r := search.Request(req).Index(idx)

	http_req, _ := _r.HttpRequest(ctx)

	buf := new(strings.Builder)
	_, err = io.Copy(buf, http_req.Body)
	rawReq := buf.String()

	res, err := _r.Do(ctx)

	if err != nil {
		return nil, fmt.Errorf("Could not search spans: %+v", err)
	}

	defer res.Body.Close()

	searchResp, err := parseSpansResponse(res)

	if err != nil {
		return nil, fmt.Errorf("Could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func buildQuery(b *search.RequestBuilder, fs ...spansquery.SearchFilter) (*search.RequestBuilder, error) {
	var err error
	query := types.NewQueryContainerBuilder()

	var kvFilters []spansquery.KeyValueFilter

	for _, f := range fs {
		if f.KeyValueFilter != nil {
			kvFilters = append(kvFilters, *f.KeyValueFilter)
		}
	}
	query, err = querybuilder.BuildFilters(query, kvFilters...)

	if err != nil {
		return nil, fmt.Errorf("Could not build filters: %+v", err)
	}

	return b.Query(query), nil
}

func buildSort(b *search.RequestBuilder, s ...spansquery.Sort) (*search.RequestBuilder, error) {
	DIRECTION := map[bool]sortorder.SortOrder{true: sortorder.Asc, false: sortorder.Desc}

	var sorts []types.SortCombinations
	for _, _s := range s {
		sorts = append(sorts, types.NewSortCombinationsBuilder().
			Field(types.Field(_s.Field)).
			SortOptions(types.NewSortOptionsBuilder().
				SortOptions(map[types.Field]*types.FieldSortBuilder{
					types.Field(_s.Field): types.NewFieldSortBuilder().Order(DIRECTION[_s.Ascending]),
				}),
			),
		)
	}
	return b.Sort(types.NewSortBuilder().Sort(types.Sort(sorts))), nil

}

func parseSpansResponse(res *http.Response) (*spansquery.SearchResponse, error) {
	// check errors
	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	rawBody, _ := json.Marshal(body)

	if res.StatusCode >= 400 {
		return nil, fmt.Errorf("Could not search spans, got status: %+v, raw body req: %+v", res.StatusCode, string(rawBody))
	}

	hits := body["hits"].(map[string]any)["hits"].([]any)

	spans := []*internalspan.InternalSpan{}

	for _, h := range hits {
		hit := h.(map[string]any)["_source"].(map[string]any)
		var s internalspan.InternalSpan
		mapstructure.Decode(hit, &s)
		spans = append(spans, &s)
	}

	return &spansquery.SearchResponse{Spans: spans}, nil
}
