package utils

import (
	"fmt"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

func CreateTimeframeFilters(tf model.Timeframe) []model.SearchFilter {
	return []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.startTimeUnixNano",
				Operator: spansquery.OPERATOR_GTE,
				Value:    tf.StartTime,
			},
		},
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.endTimeUnixNano",
				Operator: spansquery.OPERATOR_LTE,
				Value:    tf.EndTime,
			},
		},
	}

}

func BuildQuery(b *search.RequestBuilder, fs ...model.SearchFilter) (*search.RequestBuilder, error) {
	var err error
	query := types.NewQueryContainerBuilder()

	var kvFilters []model.KeyValueFilter

	for _, f := range fs {
		if f.KeyValueFilter != nil {
			kvFilters = append(kvFilters, *f.KeyValueFilter)
		}
	}
	query, err = BuildFilters(query, kvFilters...)

	if err != nil {
		return nil, fmt.Errorf("Could not build filters: %+v", err)
	}

	return b.Query(query), nil
}
