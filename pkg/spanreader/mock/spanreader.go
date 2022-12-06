/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package mock

import (
	"context"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/pkg/spanreader"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"

	spansquery "oss-tracing/pkg/model/spansquery/v1"

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
	ctx context.Context, r tagsquery.TagValuesRequest, tags []string,
) (map[string]*tagsquery.TagValuesResponse, error) {
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
