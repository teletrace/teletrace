package searchcontroller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"oss-tracing/pkg/model"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
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

	search := sc.client.API.Search()
	res, err := search.Request(req).Index(sc.idx).Do(ctx)

	if err != nil {
		return nil, fmt.Errorf("Could not search spans: %+v", err)
	}

	defer res.Body.Close()

	body, err := decodeResponse(res)

	if err != nil {
		return nil, fmt.Errorf("Could not decode http response: %+v", err)
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

	timeframeFilters := createTimeframeFilters(r.Timeframe)

	filters := append(r.SearchFilters, timeframeFilters...)

	if builder, err = buildQuery(builder, filters...); err != nil {
		return nil, fmt.Errorf("Could not build query for search request: %+v. err: %+v", r, err)
	}

	builder = buildSort(builder, r.Sort...)

	builder = builder.Size(200) // Where to get this number from?

	return builder.Build(), nil
}

func createTimeframeFilters(tf model.Timeframe) []spansquery.SearchFilter {
	return []spansquery.SearchFilter{
		{
			KeyValueFilter: &spansquery.KeyValueFilter{
				Key:      "span.startTimeUnixNano",
				Operator: spansquery.OPERATOR_GTE,
				Value:    tf.StartTime,
			},
		},
		{
			KeyValueFilter: &spansquery.KeyValueFilter{
				Key:      "span.endTimeUnixNano",
				Operator: spansquery.OPERATOR_LTE,
				Value:    tf.EndTime,
			},
		},
	}

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
	query, err = BuildFilters(query, kvFilters...)

	if err != nil {
		return nil, fmt.Errorf("Could not build filters: %+v", err)
	}

	return b.Query(query), nil
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
		return nil, fmt.Errorf("Could not search spans, got status: %+v", res.StatusCode)
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

	return &spansquery.SearchResponse{Spans: spans}, nil
}
