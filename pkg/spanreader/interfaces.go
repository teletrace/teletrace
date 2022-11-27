package spanreader

import (
	"context"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type SpanReader interface {
	Initialize() error
	Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error)
	GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error)
	GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error)
}
