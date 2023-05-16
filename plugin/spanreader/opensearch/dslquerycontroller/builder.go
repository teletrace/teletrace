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
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/common"

	"github.com/teletrace/teletrace/pkg/model"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
)

const TieBreakerField = "span.spanId.keyword"

type (
	FilterBuildOption     func(*model.KeyValueFilter)
	SearchBodyBuildOption func(Body) Body
)

func BuildSort(s []spansquery.Sort) []Sort {
	DIRECTION := map[bool]string{true: "asc", false: "desc"}

	var sorts []Sort
	tieBreakerFound := false
	for _, _s := range s {
		if _s.Field == TieBreakerField {
			tieBreakerFound = true
		}
		sorts = append(sorts, Sort{
			string(_s.Field): {
				Order: DIRECTION[_s.Ascending],
			},
		})
	}
	if !tieBreakerFound {
		sorts = append(sorts, Sort{
			TieBreakerField: {
				Order: DIRECTION[true],
			},
		})
	}

	return sorts
}

func BuildSearchAfter(st spansquery.ContinuationToken) (SearchAfter, error) {
	var sortKeys SearchAfter
	if st == "" {
		return sortKeys, nil
	}
	if err := json.Unmarshal([]byte(st), &sortKeys); err != nil {
		return nil, err
	}
	return sortKeys, nil
}

func BuildSetSystemIdBody(v string) (io.Reader, error) {
	body := map[string]string{
		"value": v,
	}
	jsQuery, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("Failed to marshal query to json: %+v", err)
	}
	stringQuery := string(jsQuery)
	return strings.NewReader(stringQuery), nil
}

func BuildTagsStatisticsAggs(s []tagsquery.TagStatistic, tag string) (map[string]AggregationsContainer, error) {
	aggs := make(map[string]AggregationsContainer)

	for _, d := range s {
		h := TagStatisticToHandler[d]
		h.AddAggregationContainerBuilder(tag, aggs)
	}

	return aggs, nil
}

func BuildTagsValuesAggs(t []tagsquery.TagInfo) (map[string]AggregationsContainer, error) {
	aggs := make(map[string]AggregationsContainer, len(t))
	for _, mapping := range t {
		aggregationKey := mapping.Name
		aggregationField := aggregationKey
		if mapping.Type == "Str" {
			aggregationField = fmt.Sprintf("%s.keyword", aggregationKey)
		}
		aggs[aggregationKey] = AggregationsContainer{
			Terms: &TermsAggregation{
				Field: aggregationField,
				Size:  100,
			},
		}
	}
	return aggs, nil
}

func BuildTimeframeFilters(tf *model.Timeframe) []model.SearchFilter {
	if tf == nil {
		return []model.SearchFilter{}
	}
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

func BuildFiltersWithTimeFrame(fs []model.SearchFilter, tf *model.Timeframe, opts ...FilterBuildOption) (*QueryContainer, error) {
	timeframeFilters := BuildTimeframeFilters(tf)
	filters := append(fs, timeframeFilters...)
	return BuildFilters(filters, opts...)
}

func BuildFilters(fs []model.SearchFilter, opts ...FilterBuildOption) (*QueryContainer, error) {
	type filterCreator func(model.KeyValueFilter) (*QueryContainer, error)

	type Filter struct {
		Builder filterCreator
		Must    bool
	}

	var must []QueryContainer
	var mustNot []QueryContainer

	m := map[string]Filter{
		spansquery.OPERATOR_EQUALS: {
			Builder: createEqualsFilter,
			Must:    true,
		},
		spansquery.OPERATOR_NOT_EQUALS: {
			Builder: createEqualsFilter,
			Must:    false,
		},
		spansquery.OPERATOR_CONTAINS: {
			Builder: createContainsFilter,
			Must:    true,
		},
		spansquery.OPERATOR_NOT_CONTAINS: {
			Builder: createContainsFilter,
			Must:    false,
		},
		spansquery.OPERATOR_EXISTS: {
			Builder: createExistsFilter,
			Must:    true,
		},
		spansquery.OPERATOR_NOT_EXISTS: {
			Builder: createExistsFilter,
			Must:    false,
		},
		spansquery.OPERATOR_IN: {
			Builder: createInFilter,
			Must:    true,
		},
		spansquery.OPERATOR_NOT_IN: {
			Builder: createInFilter,
			Must:    false,
		},
		spansquery.OPERATOR_GT: {
			Builder: createRangeFilter,
			Must:    true,
		},
		spansquery.OPERATOR_GTE: {
			Builder: createRangeFilter,
			Must:    true,
		},
		spansquery.OPERATOR_LTE: {
			Builder: createRangeFilter,
			Must:    true,
		},
		spansquery.OPERATOR_LT: {
			Builder: createRangeFilter,
			Must:    true,
		},
	}

	for _, f := range fs {
		if f.KeyValueFilter != nil {
			kvf := f.KeyValueFilter
			var err error

			for _, opt := range opts {
				opt(kvf)
			}

			filter := m[string(kvf.Operator)]
			qc, err := filter.Builder(*kvf)
			if err != nil {
				return nil, fmt.Errorf("Could not create filter from: %+v: %+v", f, err)
			}

			if filter.Must {
				must = append(must, *qc)
			} else {
				mustNot = append(mustNot, *qc)
			}
		}
	}

	qc := QueryContainer{}
	if len(must) == 0 && len(mustNot) == 0 {
		return nil, nil
	}

	qc.Bool = &BoolQuery{
		Must:    must,
		MustNot: mustNot,
	}

	return &qc, nil
}

func createEqualsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	m := MatchPhrase{}

	m[string(f.Key)] = fmt.Sprintf("%+v", f.Value)

	qc := QueryContainer{}
	qc.MatchPhrase = m
	return &qc, nil
}

func createInFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	var shouldQueriesArray []MatchPhrase

	jsVal, err := json.Marshal(f.Value)
	if err != nil {
		return nil, fmt.Errorf("Could not parse IN filter value: %+v", err)
	}

	sliceVal := []any{}
	err = json.Unmarshal(jsVal, &sliceVal)

	if err != nil {
		return nil, fmt.Errorf("Could not parse IN filter value as array: %+v", err)
	}

	for _, v := range sliceVal {
		m := MatchPhrase{}

		m[string(f.Key)] = fmt.Sprintf("%+v", v)

		shouldQueriesArray = append(shouldQueriesArray, m)
	}

	qcSlice := []QueryContainer{}

	for _, q := range shouldQueriesArray {
		qc := QueryContainer{}
		qc.MatchPhrase = q
		qcSlice = append(qcSlice, qc)
	}

	qc := QueryContainer{}
	qc.Bool = &BoolQuery{
		Should: qcSlice,
	}

	return &qc, nil
}

func createContainsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	qc := QueryContainer{}

	m := WildCard{}

	m[string(f.Key)] = WildCardQuery{
		Value: (fmt.Sprintf("*%+v*", f.Value)),
	}

	qc.Wildcard = m

	return &qc, nil
}

func createExistsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	qc := QueryContainer{}
	qc.Exists = &ExistsQuery{
		Field: string(f.Key),
	}
	return &qc, nil
}

func createRangeFilter(f model.KeyValueFilter) (*QueryContainer, error) { // also handle GTE / GT / LTE / LT
	qc := QueryContainer{}

	m := Range{}

	var fVal float64

	switch castValue := f.Value.(type) {
	case int:
		fVal = float64(castValue)
	case int32:
		fVal = float64(castValue)
	case int64:
		fVal = float64(castValue)
	case uint:
		fVal = float64(castValue)
	case uint32:
		fVal = float64(castValue)
	case uint64:
		fVal = float64(castValue)
	case float32:
		fVal = float64(castValue)
	case float64:
		fVal = castValue
	case string:
		var err error
		fVal, err = strconv.ParseFloat(castValue, 64)
		if err != nil {
			return nil, fmt.Errorf("Could not parse RANGE filter value as float64: %+v", f.Value)
		}
	default:
		return nil, fmt.Errorf("Could not parse RANGE filter value as float64: %+v", f.Value)
	}

	r := RangeQuery{}

	switch op := f.Operator; string(op) {
	case spansquery.OPERATOR_GT:
		r.Gt = &fVal
	case spansquery.OPERATOR_GTE:
		r.Gte = &fVal
	case spansquery.OPERATOR_LTE:
		r.Lte = &fVal
	case spansquery.OPERATOR_LT:
		r.Lt = &fVal
	}

	m[string(f.Key)] = r
	qc.Range = m

	return &qc, nil
}

// opts
func WithMilliSecTimestampAsNanoSecFilter() FilterBuildOption {
	return func(f *model.KeyValueFilter) {
		if common.IsConvertedTimestamp(f.Key) {
			switch castValue := f.Value.(type) {
			case float64:
				f.Value = common.NanoToMilliFloat64(castValue)
			case uint64:
				f.Value = common.NanoToMilliUint64(castValue)
			}
		}
	}
}

func WithQuery(qc *QueryContainer) SearchBodyBuildOption {
	return func(b Body) Body {
		if qc == nil {
			return b
		}
		b.Query = qc
		return b
	}
}

func WithAggregations(aggs map[string]AggregationsContainer) SearchBodyBuildOption {
	return func(b Body) Body {
		if len(aggs) == 0 {
			return b
		}
		b.Aggregations = aggs
		return b
	}
}

func WithSort(s []Sort) SearchBodyBuildOption {
	return func(b Body) Body {
		if len(s) == 0 {
			return b
		}
		b.Sorts = s
		return b
	}
}

func WithSize(s int) SearchBodyBuildOption {
	return func(b Body) Body {
		b.Size = s
		return b
	}
}

func WithSearchAfter(s SearchAfter) SearchBodyBuildOption {
	return func(b Body) Body {
		if len(s) == 0 {
			return b
		}
		b.SearchAfter = s
		return b
	}
}

// build query
func BuildQueryBody(opts ...SearchBodyBuildOption) Body {
	body := Body{}

	for _, opt := range opts {
		body = opt(body)
	}

	return body
}

func MarshalBody(b Body) (io.Reader, error) {
	jsQuery, err := json.Marshal(b)
	if err != nil {
		return nil, fmt.Errorf("Failed to marshal query to json: %+v", err)
	}
	stringQuery := string(jsQuery)

	return strings.NewReader(stringQuery), nil
}
