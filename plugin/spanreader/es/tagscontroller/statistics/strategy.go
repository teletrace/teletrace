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

var TagStatisticToStrategy = map[tagsquery.TagStatistic]StatisticStrategy{
	tagsquery.Min: &minStrategy{},
	tagsquery.Max: &maxStrategy{},
	tagsquery.Avg: &avgStrategy{},
	tagsquery.P99: &p99Strategy{},
}

type StatisticStrategy interface {
	AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder)
	GetValue(tag string, aggs map[string]any) float64
}

type minStrategy struct{}

func (s *minStrategy) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["min"] = types.NewAggregationContainerBuilder().Min(types.NewMinAggregationBuilder().Field(types.Field(tag)))
}

func (s *minStrategy) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["min"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type maxStrategy struct{}

func (s *maxStrategy) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["max"] = types.NewAggregationContainerBuilder().Max(types.NewMaxAggregationBuilder().Field(types.Field(tag)))
}

func (s *maxStrategy) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["max"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type avgStrategy struct{}

func (s *avgStrategy) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["avg"] = types.NewAggregationContainerBuilder().Avg(types.NewAverageAggregationBuilder().Field(types.Field(tag)))
}

func (s *avgStrategy) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["avg"].(map[string]any)["value"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}

type p99Strategy struct{}

func (s *p99Strategy) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["percentiles"] = types.NewAggregationContainerBuilder().Percentiles(types.NewPercentilesAggregationBuilder().Field(types.Field(tag)))
}

func (s *p99Strategy) GetValue(tag string, aggs map[string]any) float64 {
	value := aggs["percentiles"].(map[string]any)["values"].(map[string]any)["99.0"].(float64)

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value)
	}

	return value
}
