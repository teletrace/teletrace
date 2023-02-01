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

var TagStatisticToHandler = map[tagsquery.TagStatistic]StatisticHandler{
	tagsquery.Min: &minHandler{},
	tagsquery.Max: &maxHandler{},
	tagsquery.Avg: &avgHandler{},
	tagsquery.P99: &p99Handler{},
}

type StatisticHandler interface {
	AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder)
	GetValue(tag string, aggs map[string]any) (float64, bool)
}

type minHandler struct{}

func (h *minHandler) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["min"] = types.NewAggregationContainerBuilder().Min(types.NewMinAggregationBuilder().Field(types.Field(tag)))
}

func (h *minHandler) GetValue(tag string, aggs map[string]any) (float64, bool) {
	value := aggs["min"].(map[string]any)["value"]
	if value == nil {
		return -1, false
	}

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value.(float64))
	}

	return value.(float64), true
}

type maxHandler struct{}

func (h *maxHandler) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["max"] = types.NewAggregationContainerBuilder().Max(types.NewMaxAggregationBuilder().Field(types.Field(tag)))
}

func (h *maxHandler) GetValue(tag string, aggs map[string]any) (float64, bool) {
	value := aggs["max"].(map[string]any)["value"]
	if value == nil {
		return -1, false
	}

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value.(float64))
	}

	return value.(float64), true
}

type avgHandler struct{}

func (h *avgHandler) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["avg"] = types.NewAggregationContainerBuilder().Avg(types.NewAverageAggregationBuilder().Field(types.Field(tag)))
}

func (h *avgHandler) GetValue(tag string, aggs map[string]any) (float64, bool) {
	value := aggs["avg"].(map[string]any)["value"]
	if value == nil {
		return -1, false
	}

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value.(float64))
	}

	return value.(float64), true
}

type p99Handler struct{}

func (h *p99Handler) AddAggregationContainerBuilder(tag string, aggs map[string]*types.AggregationContainerBuilder) {
	aggs["percentiles"] = types.NewAggregationContainerBuilder().Percentiles(types.NewPercentilesAggregationBuilder().Field(types.Field(tag)))
}

func (h *p99Handler) GetValue(tag string, aggs map[string]any) (float64, bool) {
	value := aggs["percentiles"].(map[string]any)["values"].(map[string]any)["99.0"]
	if value == nil {
		return -1, false
	}

	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		value = spanreaderes.MilliToNanoFloat64(value.(float64))
	}

	return value.(float64), true
}
