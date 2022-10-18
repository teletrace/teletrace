package typedreqinteractor

import (
	"context"
	"fmt"
	"io"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/esclient/typedreqinteractor/querybuilder"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/sortorder"
)

type documentController struct {
	client *Client
}

func NewDocumentController(client *Client) interactor.DocumentController {
	return &documentController{client: client}
}

func (c *documentController) Bulk(ctx context.Context, docs ...*interactor.Doc) error {
	return nil
}

func (c *documentController) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
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

	search := c.client.Client.API.Search()
	res, err := search.Request(req).Do(ctx)

	if err != nil {
		return nil, fmt.Errorf("Could not search spans: %+v", err)
	}

	defer res.Body.Close()

	searchResp, err := parseSpansResponseBody(&res.Body)

	if err != nil {
		return nil, fmt.Errorf("Could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func buildQuery(b *search.RequestBuilder, fs ...spansquery.SearchFilter) (*search.RequestBuilder, error) {
	var err error
	query := types.NewQueryContainerBuilder()

	query, err = querybuilder.BuildFilters(query, fs...)

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

func parseSpansResponseBody(body *io.ReadCloser) (*spansquery.SearchResponse, error) {

}
