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

package aggscontroller

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"
	"github.com/teletrace/teletrace/plugin/spanreader/es/aggscontroller/histogram"
	spanreaderes "github.com/teletrace/teletrace/plugin/spanreader/es/utils"
	"go.uber.org/zap"
)

type aggsController struct {
	client *elasticsearch.TypedClient
	idx    string
}

func NewAggsController(logger *zap.Logger, client *elasticsearch.TypedClient, idx string) (AggsController, error) {
	return &aggsController{
		client: client,
		idx:    idx,
	}, nil
}

func (a *aggsController) GetHistograms(
	ctx context.Context, req aggsquery.HistogramsRequest,
) (*aggsquery.HistogramsResponse, error) {
	return a.performGetHistogramsRequest(ctx, req, histogram.WithMilliSecTimestampAsNanoSec())
}

func (a *aggsController) performGetHistogramsRequest(
	ctx context.Context,
	request aggsquery.HistogramsRequest,
	opts ...histogram.HistogramsParseOption,
) (*aggsquery.HistogramsResponse, error) {
	req, err := buildHistogramsRequest(request)
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %s", err)
	}

	res, err := a.client.API.Search().Request(req).Index(a.idx).Do(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to perform search: %s", err)
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	return a.parseHistogramsResponse(body, request, opts)
}

func buildHistogramsRequest(req aggsquery.HistogramsRequest) (*search.Request, error) {
	builder := search.NewRequestBuilder()
	timeframeFilters := spanreaderes.CreateTimeframeFilters(req.Timeframe)
	filters := append(req.SearchFilters, timeframeFilters...)
	_, err := spanreaderes.BuildQuery(builder, filters...)
	if err != nil {
		return nil, err
	}
	builder.Size(0)

	aggregations := make(map[string]*types.AggregationContainerBuilder)

	for label, agg := range req.Aggregations {
		handler := histogram.AggregationFunctionToHandler[agg.Func]

		// Create a new histogram aggregation
		histogramAgg := types.NewAggregationContainerBuilder().Histogram(
			types.NewHistogramAggregationBuilder().Field(types.Field(req.IntervalKey)).Interval(req.Interval),
		)

		// Add the histogram as a sub aggregation of the existing aggregation
		aggregations[label] = histogramAgg

		// Add a sub aggregation
		if err := handler.AddSubAggregation(label, agg, histogramAgg); err != nil {
			return nil, fmt.Errorf("an error occurred while building aggregations: %+v", err)
		}
	}

	request := builder.Aggregations(aggregations).Build()
	return request, nil
}

func (a *aggsController) parseHistogramsResponse(
	body map[string]any, request aggsquery.HistogramsRequest, opts []histogram.HistogramsParseOption,
) (*aggsquery.HistogramsResponse, error) {
	result := aggsquery.HistogramsResponse{
		Histograms: []aggsquery.Histogram{},
	}

	if aggregations, ok := body["aggregations"].(map[string]any); ok {
		for label, aggregation := range request.Aggregations {
			handler := histogram.AggregationFunctionToHandler[aggregation.Func]
			h := handler.GetHistogram(aggregations, label)
			result.Histograms = append(result.Histograms, h)
		}
	}

	for _, opt := range opts {
		opt(request.IntervalKey, result.Histograms)
	}

	return &result, nil
}
