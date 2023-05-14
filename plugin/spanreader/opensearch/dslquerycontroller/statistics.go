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

package dslquerycontroller

import (
    "github.com/teletrace/teletrace/pkg/model"
    "github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
)

type TagStatisticParseOption func(string, map[tagsquery.TagStatistic]float64, tagsquery.TagStatistic)

var TagStatisticToHandler = map[tagsquery.TagStatistic]StatisticHandler{
    tagsquery.MIN: &minHandler{},
    tagsquery.MAX: &maxHandler{},
    tagsquery.AVG: &avgHandler{},
    tagsquery.P99: &p99Handler{},
}

type StatisticHandler interface {
    AddAggregationContainerBuilder(tag string, aggs map[string]AggregationsContainer)
    GetValue(aggs map[string]any) (float64, bool)
}

type minHandler struct{}

func (h *minHandler) AddAggregationContainerBuilder(tag string, aggs map[string]AggregationsContainer) {
    aggs["min"] = AggregationsContainer{
        Min: &MinAggregation{
            Field: &tag,
        },
    }
}

func (h *minHandler) GetValue(aggs map[string]any) (float64, bool) {
    value := aggs["min"].(map[string]any)["value"]
    if value == nil {
        return -1, false
    }

    return value.(float64), true
}

type maxHandler struct{}

func (h *maxHandler) AddAggregationContainerBuilder(tag string, aggs map[string]AggregationsContainer) {
    aggs["max"] = AggregationsContainer{
        Max: &MaxAggregation{
            Field: &tag,
        },
    }
}

func (h *maxHandler) GetValue(aggs map[string]any) (float64, bool) {
    value := aggs["max"].(map[string]any)["value"]
    if value == nil {
        return -1, false
    }

    return value.(float64), true
}

type avgHandler struct{}

func (h *avgHandler) AddAggregationContainerBuilder(tag string, aggs map[string]AggregationsContainer) {
    aggs["avg"] = AggregationsContainer{
        Avg: &AverageAggregation{
            Field: &tag,
        },
    }
}

func (h *avgHandler) GetValue(aggs map[string]any) (float64, bool) {
    value := aggs["avg"].(map[string]any)["value"]
    if value == nil {
        return -1, false
    }

    return value.(float64), true
}

type p99Handler struct{}

func (h *p99Handler) AddAggregationContainerBuilder(tag string, aggs map[string]AggregationsContainer) {
    aggs["percentiles"] = AggregationsContainer{
        Percentiles: &PercentilesAggregation{
            Field: &tag,
        },
    }
}

func (h *p99Handler) GetValue(aggs map[string]any) (float64, bool) {
    value := aggs["percentiles"].(map[string]any)["values"].(map[string]any)["99.0"]
    if value == nil {
        return -1, false
    }

    return value.(float64), true
}

func WithMilliSecTimestampAsNanoSecTagStatistics() TagStatisticParseOption {
    return func(tag string, statistics map[tagsquery.TagStatistic]float64, s tagsquery.TagStatistic) {
        if IsConvertedTimestamp(model.FilterKey(tag)) {
            statistics[s] = MilliToNanoFloat64(statistics[s])
        }
    }
}

func ParseTagStatisticsResponseBody(
    body map[string]any, request tagsquery.TagStatisticsRequest, tag string, opts []TagStatisticParseOption,
) (*tagsquery.TagStatisticsResponse, error) {
    result := &tagsquery.TagStatisticsResponse{
        Statistics: make(map[tagsquery.TagStatistic]float64),
    }

    if aggregations, ok := body["aggregations"].(map[string]any); ok {
        for _, ds := range request.DesiredStatistics {
            h := TagStatisticToHandler[ds]
            if v, exists := h.GetValue(aggregations); exists {
                result.Statistics[ds] = v
            }
        }
    }

    for k := range result.Statistics {
        for _, opt := range opts {
            opt(tag, result.Statistics, k)
        }
    }

    return result, nil
}
