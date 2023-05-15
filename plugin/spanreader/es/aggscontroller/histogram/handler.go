package histogram

import (
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"
)

var AggregationFunctionToHandler = map[aggsquery.AggregationFunction]Handler{
	aggsquery.COUNT:          &countHandler{},
	aggsquery.DISTINCT_COUNT: &distinctCountHandler{},
	aggsquery.PERCENTILES:    &percentilesHandler{},
}

type Handler interface {
	AddSubAggregation(label string, aggregation aggsquery.Aggregation, aggs *types.AggregationContainerBuilder)
	GetHistogram(aggs map[string]any, label string) aggsquery.Histogram
}

type baseHandler struct{}

func (h *baseHandler) GetHistogram(aggs map[string]any, label string) aggsquery.Histogram {
	// Extract the relevant data from the aggs map
	resultBuckets := aggs[label].(map[string]any)["buckets"].([]map[string]any)

	var buckets []aggsquery.Bucket
	// For each bucket in the aggregation:
	for _, resultBucket := range resultBuckets {
		bucket := aggsquery.Bucket{
			BucketKey: resultBucket["key"],
			Data:      resultBucket["doc_count"],
		}

		buckets = append(buckets, bucket)
	}

	return aggsquery.Histogram{
		HistogramLabel: label,
		Buckets:        buckets,
	}
}

type countHandler struct {
	baseHandler
}

func (h *countHandler) AddSubAggregation(
	label string, _ aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) {
	valueCountAgg := types.NewAggregationContainerBuilder().ValueCount(
		types.NewValueCountAggregationBuilder().Field("span.spanId.keyword"),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: valueCountAgg},
	)
}

type distinctCountHandler struct {
	baseHandler
}

func (h *distinctCountHandler) AddSubAggregation(
	label string, aggregation aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) {
	termsAgg := types.NewAggregationContainerBuilder().Terms(
		types.NewTermsAggregationBuilder().Field(types.Field(aggregation.GroupBy)),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: termsAgg},
	)
}

type percentilesHandler struct {
	baseHandler
}

func (h *percentilesHandler) AddSubAggregation(
	label string, aggregation aggsquery.Aggregation, histogramAgg *types.AggregationContainerBuilder,
) {
	percentilesAgg := types.NewAggregationContainerBuilder().Percentiles(
		types.NewPercentilesAggregationBuilder().Field(types.Field(aggregation.Key)).Percents(
			[]float64{50, 75, 90, 95, 99}...,
		),
	)

	histogramAgg.Aggregations(
		map[string]*types.AggregationContainerBuilder{label: percentilesAgg},
	)
}
