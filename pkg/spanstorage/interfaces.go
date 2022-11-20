package storage

import (
	"context"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type Storage interface {
	Initialize() error
	CreateSpanWriter() (SpanWriter, error)
	CreateSpanReader() (SpanReader, error)
}

type SpanWriter interface {
	WriteSpan(ctx context.Context, span *internalspan.InternalSpan) error
	WriteBulk(ctx context.Context, spans ...*internalspan.InternalSpan) error
	Close(ctx context.Context) error
}

type SpanReader interface {
	Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error)
	GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error)
	GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error)
}
