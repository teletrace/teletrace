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

func (a *aggsController) GetHistogram(
	ctx context.Context, req aggsquery.HistogramRequest,
) (aggsquery.HistogramResponse, error) {
	return a.performGetHistogramRequest(ctx, req, histogram.WithMilliSecTimestampAsNanoSec())
}

func (a *aggsController) performGetHistogramRequest(
	ctx context.Context,
	request aggsquery.HistogramRequest,
	opts ...histogram.HistogramsParseOption,
) (aggsquery.HistogramResponse, error) {
	req, err := buildHistogramRequest(request)
	if err != nil {
		return aggsquery.HistogramResponse{}, fmt.Errorf("failed to build query: %s", err)
	}

	res, err := a.client.API.Search().Request(req).Index(a.idx).Do(ctx)
	if err != nil {
		return aggsquery.HistogramResponse{}, fmt.Errorf("failed to perform search: %s", err)
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return aggsquery.HistogramResponse{}, fmt.Errorf("failed parsing the response body: %s", err)
	}

	return a.parseHistogramResponse(body, request, opts)
}

func buildHistogramRequest(req aggsquery.HistogramRequest) (*search.Request, error) {
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

		// Add a sub aggregation
		handler.AddSubAggregation(label, agg, histogramAgg)

		// Add the histogram as a sub aggregation of the existing aggregation
		aggregations[label] = histogramAgg
	}

	request := builder.Aggregations(aggregations).Build()
	return request, nil
}

func (a *aggsController) parseHistogramResponse(
	body map[string]any, request aggsquery.HistogramRequest, opts []histogram.HistogramsParseOption,
) (aggsquery.HistogramResponse, error) {
	result := aggsquery.HistogramResponse{
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

	return result, nil
}
