package mock

import (
	"context"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	spanstorage "oss-tracing/pkg/spanstorage"
)

type spanWriter struct{}

type spanReader struct{}

type storage struct{}

func (sw spanWriter) WriteSpan(ctx context.Context, span *internalspan.InternalSpan) error {
	return nil
}

func (sw spanWriter) AddToBulk(ctx context.Context, span ...*internalspan.InternalSpan) error {
	return nil
}

func (sw spanWriter) FlushBulk(ctx context.Context) error {
	return nil
}

func (sr spanReader) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return nil, nil
}

func (s storage) CreateSpanWriter() (spanstorage.SpanWriter, error) {
	return spanWriter{}, nil
}

func (s storage) CreateSpanReader() (spanstorage.SpanReader, error) {
	return spanReader{}, nil
}

func (s storage) Initialize() error {
	return nil
}

func NewStorageMock() (spanstorage.Storage, error) {
	return storage{}, nil
}
