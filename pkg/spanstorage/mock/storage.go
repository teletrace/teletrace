package mock

import (
	"context"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	spanformatutiltests "oss-tracing/pkg/model/internalspan/v1/util"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	spanstorage "oss-tracing/pkg/spanstorage"
)

type spanWriter struct{}

type spanReader struct{}

type storage struct{}

func (sw spanWriter) WriteSpan(ctx context.Context, span *internalspan.InternalSpan) error {
	return nil
}

func (sw spanWriter) WriteBulk(ctx context.Context, span ...*internalspan.InternalSpan) error {
	return nil
}

func (sw spanWriter) Close(ctx context.Context) error {
	return nil
}

func (sr spanReader) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	spans := []*internalspan.InternalSpan{spanformatutiltests.GenInternalSpan(nil, nil, nil)}
	return &spansquery.SearchResponse{
		Metadata: nil,
		Spans:    spans,
	}, nil
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
