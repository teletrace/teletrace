/**
 * Copyright 2022 Cisco Systems, Inc.
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

	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"

	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"github.com/teletrace/teletrace/pkg/spanreader"

	internalspan "github.com/teletrace/teletrace/model/internalspan/v1"

	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"

	spanformatutiltests "github.com/teletrace/teletrace/model/internalspan/v1/util"
)

type spanReader struct{}

func (sr spanReader) GetHistograms(ctx context.Context, req aggsquery.HistogramsRequest) (*aggsquery.HistogramsResponse, error) {
	return &aggsquery.HistogramsResponse{
		Histograms: []aggsquery.Histogram{
			{
				HistogramLabel: "errors_distinct_count",
				Buckets: []aggsquery.Bucket{
					{
						BucketKey: 1684222200000000000,
						Data: map[string]any{
							aggsquery.TotalCountField: 153,
							aggsquery.SubBucketsField: []map[string]any{
								{
									"count": 76,
									"key":   500,
								},
								{
									"count": 35,
									"key":   404,
								},
							},
						},
					},
					{
						BucketKey: 1684222800000000000,
						Data: map[string]any{
							aggsquery.TotalCountField: 168,
							aggsquery.SubBucketsField: []map[string]any{
								{
									"count": 83,
									"key":   500,
								},
								{
									"count": 9,
									"key":   308,
								},
							},
						},
					},
					{
						BucketKey: 1684223400000000000,
						Data: map[string]any{
							aggsquery.TotalCountField: 0,
							aggsquery.SubBucketsField: []map[string]any{}},
					},
				},
			},
		},
	}, nil
}

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

func (sr spanReader) GetTagsStatistics(ctx context.Context, r tagsquery.TagStatisticsRequest, tag string) (*tagsquery.TagStatisticsResponse, error) {
	return &tagsquery.TagStatisticsResponse{
		Statistics: map[tagsquery.TagStatistic]float64{
			"min": 0.0,
			"max": 10.0,
			"avg": 5.0,
			"p99": 9.0,
		},
	}, nil
}

func (sr spanReader) Initialize() error {
	return nil
}

func (sr spanReader) GetSystemId(ctx context.Context, r metadata.GetSystemIdRequest) (*metadata.GetSystemIdResponse, error) {
	return &metadata.GetSystemIdResponse{Value: "352b4249-ba14-4f8f-a439-a5df0812cf37"}, nil
}

func (sr spanReader) SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	return &metadata.SetSystemIdResponse{}, nil
}

func NewSpanReaderMock() (spanreader.SpanReader, error) {
	return spanReader{}, nil
}
