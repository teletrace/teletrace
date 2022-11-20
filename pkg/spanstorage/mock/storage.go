package mock

import (
	"context"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	spanformatutiltests "oss-tracing/pkg/model/internalspan/v1/util"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
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

func (sr spanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return &tagsquery.GetAvailableTagsResponse{
		Tags: []tagsquery.TagInfo{
			{
				Name: "custom-tag",
				Type: "string",
			},
		},
	}, nil
}

func (sr spanReader) GetTagsValues(
	ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	res := map[string]*tagsquery.TagValuesResponse{
		"span.attributes.custom-tag": &tagsquery.TagValuesResponse{
			Values: []tagsquery.TagValueInfo{
				{
					Value: "custom-value",
					Count: 3,
				},
			},
		},
		"span.attributes.custom-tag2": {
			Values: []tagsquery.TagValueInfo{
				{
					Value: "custom-value2",
					Count: 1,
				},
			},
		},
	}
	return res, nil
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
