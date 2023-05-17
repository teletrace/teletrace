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

package histogram

import (
	"fmt"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"
)

var AggregationFunctionToHandler = map[aggsquery.AggregationFunction]Handler{
	aggsquery.COUNT:          &countHandler{},
	aggsquery.DISTINCT_COUNT: &distinctCountHandler{},
	aggsquery.PERCENTILES:    &percentilesHandler{},
}

type Handler interface {
	AddSubAggregation(label string, aggregation aggsquery.Aggregation, aggs *types.AggregationContainerBuilder) error
	GetHistogram(aggs map[string]any, label string) aggsquery.Histogram
}

type countHandler struct{}

func (h *countHandler) AddSubAggregation(
	label string, _ aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) error {
	valueCountAgg := types.NewAggregationContainerBuilder().ValueCount(
		types.NewValueCountAggregationBuilder().Field(aggsquery.SpanIdKey),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: valueCountAgg},
	)

	return nil
}

func (h *countHandler) GetHistogram(aggs map[string]any, label string) aggsquery.Histogram {
	resultBuckets := getResultBuckets(aggs, label)

	var buckets []aggsquery.Bucket

	// Iterate each bucket in the ES result to build the response struct
	for _, resultBucket := range resultBuckets {
		bucket := aggsquery.Bucket{
			BucketKey: resultBucket.(map[string]any)["key"],
			Data:      resultBucket.(map[string]any)["doc_count"],
		}

		buckets = append(buckets, bucket)
	}

	return aggsquery.Histogram{
		HistogramLabel: label,
		Buckets:        buckets,
	}
}

type distinctCountHandler struct{}

func (h *distinctCountHandler) AddSubAggregation(
	label string, aggregation aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) error {
	termsAgg := types.NewAggregationContainerBuilder().Terms(
		types.NewTermsAggregationBuilder().Field(types.Field(aggregation.GroupBy)).Size(aggregation.MaxGroups),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: termsAgg},
	)

	return nil
}

func (h *distinctCountHandler) GetHistogram(aggs map[string]any, label string) aggsquery.Histogram {
	resultBuckets := getResultBuckets(aggs, label)

	var buckets []aggsquery.Bucket

	// Iterate each bucket in the ES result to build the response struct
	for _, resultBucket := range resultBuckets {
		var subBuckets []map[string]any
		resultSubBuckets := resultBucket.(map[string]any)[label].(map[string]any)["buckets"].([]any)

		// Iterate each bucket in the sub-aggregation to build a 'subBucket' map
		for _, rsb := range resultSubBuckets {
			subBucket := map[string]any{
				"key":   rsb.(map[string]any)["key"],
				"count": rsb.(map[string]any)["doc_count"],
			}

			subBuckets = append(subBuckets, subBucket)
		}

		data := map[string]any{
			aggsquery.TotalCountField: resultBucket.(map[string]any)["doc_count"],
			aggsquery.SubBucketsField: subBuckets,
		}

		bucket := aggsquery.Bucket{
			BucketKey: resultBucket.(map[string]any)["key"],
			Data:      data,
		}

		buckets = append(buckets, bucket)
	}

	return aggsquery.Histogram{
		HistogramLabel: label,
		Buckets:        buckets,
	}
}

type percentilesHandler struct{}

func (h *percentilesHandler) AddSubAggregation(
	label string, aggregation aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) error {
	percentiles := aggregation.AggregationParameters[aggsquery.PERCENTILES_PARAM].([]any)

	// Convert the 'percentiles' parameter to a float64 array
	percentilesFloat64 := make([]float64, len(percentiles))
	for i, val := range percentiles {
		floatVal, ok := val.(float64)
		if !ok {
			return fmt.Errorf("cannot convert '%v' to float64", val)
		}
		percentilesFloat64[i] = floatVal
	}

	percentilesAgg := types.NewAggregationContainerBuilder().Percentiles(
		types.NewPercentilesAggregationBuilder().Field(types.Field(aggregation.Key)).Percents(
			percentilesFloat64...,
		),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: percentilesAgg},
	)

	return nil
}

func (h *percentilesHandler) GetHistogram(aggs map[string]any, label string) aggsquery.Histogram {
	resultBuckets := getResultBuckets(aggs, label)

	var buckets []aggsquery.Bucket

	// Iterate each bucket in the ES result to build the response struct
	for _, resultBucket := range resultBuckets {
		// Cast the bucket from the ES result to access the expected percentiles data
		percentilesData := resultBucket.(map[string]any)[label].(map[string]any)["values"].(map[string]any)

		bucket := aggsquery.Bucket{
			BucketKey: resultBucket.(map[string]any)["key"],
			Data:      percentilesData,
		}

		buckets = append(buckets, bucket)
	}

	return aggsquery.Histogram{
		HistogramLabel: label,
		Buckets:        buckets,
	}
}

func getResultBuckets(aggs map[string]any, label string) []any {
	return aggs[label].(map[string]any)["buckets"].([]any)
}
