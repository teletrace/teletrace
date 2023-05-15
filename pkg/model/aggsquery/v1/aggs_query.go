package aggsquery

import "github.com/teletrace/teletrace/pkg/model"

type HistogramRequest struct {
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

type Aggregation struct {
	Func      AggregationFunction `json:"func"`
	GroupBy   string              `json:"groupBy,omitempty"`
	MaxGroups int                 `json:"maxGroups,omitempty"`
	Key       string              `json:"key,omitempty"`
}

type HistogramResponse struct {
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
