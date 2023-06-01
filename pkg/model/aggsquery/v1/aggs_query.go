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

package aggsquery

import (
	"fmt"

	"github.com/teletrace/teletrace/pkg/model"
)

const (
	SpanIdKey       = "span.spanId.keyword"
	SubBucketsField = "subBuckets"
	TotalCountField = "totalCount"
)

type HistogramsRequest struct {
	Timeframe     *model.Timeframe       `json:"timeframe"`
	SearchFilters []model.SearchFilter   `json:"filters"`
	Interval      float64                `json:"interval"`
	IntervalKey   string                 `json:"intervalKey"`
	Aggregations  map[string]Aggregation `json:"aggregations"`
}

type AggregationFunction string

const (
	COUNT          AggregationFunction = "COUNT"
	DISTINCT_COUNT AggregationFunction = "DISTINCT_COUNT"
	PERCENTILES    AggregationFunction = "PERCENTILES"
)

type AggregationParameter string

const (
	PERCENTILES_PARAM AggregationParameter = "percentiles"
)

type Aggregation struct {
	Func              AggregationFunction          `json:"func"`
	GroupBy           string                       `json:"groupBy,omitempty"`
	MaxGroups         int                          `json:"maxGroups,omitempty"`
	Key               string                       `json:"key,omitempty"`
	AggFunctionParams map[AggregationParameter]any `json:"aggregationParameters,omitempty"`
}

var AggregationFuncToSupportedParameters = map[AggregationFunction][]AggregationParameter{
	COUNT:          {},
	DISTINCT_COUNT: {},
	PERCENTILES:    {PERCENTILES_PARAM},
}

type HistogramsResponse struct {
	Histograms []Histogram `json:"histograms"`
}

type Bucket struct {
	BucketKey any `json:"bucketKey"`
	Data      any `json:"data"`
}

type Histogram struct {
	HistogramLabel string   `json:"histogramLabel"`
	Buckets        []Bucket `json:"buckets"`
}

func (sr *HistogramsRequest) Validate() error {
	if (sr.Timeframe.EndTime < sr.Timeframe.StartTime) && (sr.Timeframe.EndTime != 0) {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	// Search for aggregation parameters
	for _, agg := range sr.Aggregations {
		for _, p := range AggregationFuncToSupportedParameters[agg.Func] {
			_, ok := agg.AggFunctionParams[p]
			if !ok {
				return fmt.Errorf("missing aggregation parameter: %s", p)
			}
		}
	}

	return nil
}
