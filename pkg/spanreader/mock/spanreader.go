package mock

import (
	"context"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"

	spanformatutiltests "github.com/epsagon/lupa/model/internalspan/v1/util"
)

type spanReader struct{}

func (sr spanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
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
		"span.attributes.custom-tag": {
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

func (sr spanReader) Initialize() error {
	return nil
}

func NewSpanReaderMock() (spanreader.SpanReader, error) {
	return spanReader{}, nil
}
