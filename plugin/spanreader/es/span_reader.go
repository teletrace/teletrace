package spanreaderes

import (
	"context"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"
	"oss-tracing/plugin/spanreader/es/searchcontroller"
	"oss-tracing/plugin/spanreader/es/tagscontroller"

	"go.uber.org/zap"
)

const spanIdField = "span.spanId"

type spanReader struct {
	cfg              ElasticConfig
	logger           *zap.Logger
	ctx              context.Context
	searchController searchcontroller.SearchController
	tagsController   tagscontroller.TagsController
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
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
	ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	res, err := sr.tagsController.GetTagsValues(ctx, r, tags)

	if err != nil {
		return nil, fmt.Errorf("GetTagsValues failed with error: %+v", err)
	}

	return res, nil
}

func (sr *spanReader) Initialize() error {
	// This method may be implemented for other databases, not needed in ES.
	return nil

}

func NewSpanReader(ctx context.Context, logger *zap.Logger, cfg ElasticConfig) (spanreader.SpanReader, error) {
	errMsg := "cannot create a new span reader: %w"

	rawClient, err := newRawClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	typedClient, err := newTypedClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	sc, err := searchcontroller.NewSearchController(logger, typedClient, cfg.Index)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	tc, err := tagscontroller.NewTagsController(logger, rawClient, typedClient, cfg.Index)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return &spanReader{
		cfg:              cfg,
		logger:           logger,
		ctx:              ctx,
		searchController: sc,
		tagsController:   tc,
	}, nil
}
