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

package statistics

import (
	"oss-tracing/pkg/model"
	"oss-tracing/pkg/model/tagsquery/v1"
	spanreaderes "oss-tracing/plugin/spanreader/es/utils"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

var TagStatisticToResolver = map[tagsquery.TagStatistic]StatisticResolver{
	tagsquery.Min: &minResolver{},
	tagsquery.Max: &maxResolver{},
	tagsquery.Avg: &avgResolver{},
	tagsquery.P99: &p99Resolver{},
}

type StatisticResolver interface {
	AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder)
	GetValue(tag string, aggs map[string]any) float64
}

type minResolver struct{}

func (s *minResolver) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["min"] = types.NewAggregationContainerBuilder().Min(types.NewMinAggregationBuilder().Field(types.Field(tag)))
}

func (s *minResolver) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["min"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type maxResolver struct{}

func (s *maxResolver) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["max"] = types.NewAggregationContainerBuilder().Max(types.NewMaxAggregationBuilder().Field(types.Field(tag)))
}

func (s *maxResolver) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["max"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type avgResolver struct{}

func (s *avgResolver) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["avg"] = types.NewAggregationContainerBuilder().Avg(types.NewAverageAggregationBuilder().Field(types.Field(tag)))
}

func (s *avgResolver) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["avg"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type p99Resolver struct{}

func (s *p99Resolver) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["percentiles"] = types.NewAggregationContainerBuilder().Percentiles(types.NewPercentilesAggregationBuilder().Field(types.Field(tag)))
}

func (s *p99Resolver) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["percentiles"].(map[string]any)["values"].(map[string]any)["99.0"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}
