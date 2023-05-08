package spanreaderos

import (
	"context"
	"fmt"

	"github.com/teletrace/teletrace/pkg/model"
	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"github.com/teletrace/teletrace/pkg/spanreader"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/dsl"
	"go.uber.org/zap"
)

type spanReader struct {
	cfg           OpenSearchConfig
	logger        *zap.Logger
	ctx           context.Context
	dslController dsl.DslController
}

func (sr *spanReader) Initialize() error {
	// This method may be implemented for other databases, not needed in ES.
	return nil
}

func (sr *spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return sr.dslController.Search(ctx, r)
}

func (sr *spanReader) optimizeSort(s []spansquery.Sort) {
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

	ctrl := dsl.NewDslController(logger, client, opensearchConfig.Index)

	return &spanReader{
		cfg:           opensearchConfig,
		logger:        logger,
		ctx:           ctx,
		dslController: *ctrl,
	}, nil
}
