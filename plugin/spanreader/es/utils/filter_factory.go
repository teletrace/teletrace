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

package utils

import (
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"strconv"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type FilterParseOption func(*model.KeyValueFilter)

func BuildFilters(b *types.QueryContainerBuilder, fs []model.KeyValueFilter, opts ...FilterParseOption) (*types.QueryContainerBuilder, error) {
	type filterCreator func(model.KeyValueFilter) (*types.QueryContainerBuilder, error)

	type Filter struct {
		Builder filterCreator
		Must    bool
	}

	var must []types.QueryContainer
	var mustNot []types.QueryContainer

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
		var err error

		for _, opt := range opts {
			opt(&f)
		}

		filter := m[string(f.Operator)]
		qc, err := filter.Builder(f)
		if err != nil {
			return nil, fmt.Errorf("Could not create filter from: %+v: %+v", f, err)
		}

		if filter.Must {
			must = append(must, (*qc).Build())
		} else {
			mustNot = append(mustNot, (*qc).Build())
		}
	}

	return b.Bool(types.NewBoolQueryBuilder().
		MustNot(mustNot).Must(must),
	), nil
}

func WithMilliSecTimestampAsNanoSec() FilterParseOption {
	return func(f *model.KeyValueFilter) {
		if IsConvertedTimestamp(f.Key) {
			if v, ok := (f.Value).(uint64); ok {
				f.Value = NanoToMilli(v)
			}
		}
	}
}

func createEqualsFilter(f model.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.MatchPhraseQueryBuilder{}

	m[types.Field(f.Key)] = types.NewMatchPhraseQueryBuilder().Query(fmt.Sprintf("%+v", f.Value)) // TODO hacky, should be better typing with PB request

	return qc.MatchPhrase(m), nil
}

func createInFilter(f model.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	var shouldQueriesArray []map[types.Field]*types.MatchPhraseQueryBuilder

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
		m := map[types.Field]*types.MatchPhraseQueryBuilder{}

		m[types.Field(f.Key)] = types.NewMatchPhraseQueryBuilder().Query(fmt.Sprintf("%+v", v))

		shouldQueriesArray = append(shouldQueriesArray, m)
	}

	qcSlice := []types.QueryContainer{}

	for _, q := range shouldQueriesArray {
		qcSlice = append(qcSlice, types.NewQueryContainerBuilder().MatchPhrase(q).Build())
	}

	return types.NewQueryContainerBuilder().Bool(types.NewBoolQueryBuilder().Should(qcSlice)), nil
}

func createContainsFilter(f model.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.WildcardQueryBuilder{}

	m[types.Field(f.Key)] = types.NewWildcardQueryBuilder().Value(fmt.Sprintf("*%+v*", f.Value))

	return qc.Wildcard(m), nil
}

func createExistsFilter(f model.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	return qc.Exists(types.NewExistsQueryBuilder().Field(types.Field(f.Key))), nil
}

func createRangeFilter(f model.KeyValueFilter) (*types.QueryContainerBuilder, error) { // also handle GTE / GT / LTE / LT
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.RangeQueryBuilder{}

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

	r := types.NewNumberRangeQueryBuilder()

	switch op := f.Operator; string(op) {
	case spansquery.OPERATOR_GT:
		r = r.Gt(fVal)
	case spansquery.OPERATOR_GTE:
		r = r.Gte(fVal)
	case spansquery.OPERATOR_LTE:
		r = r.Lte(fVal)
	case spansquery.OPERATOR_LT:
		r = r.Lt(fVal)
	}

	m[types.Field(f.Key)] = types.NewRangeQueryBuilder().NumberRangeQuery(r)

	return qc.Range(m), nil
}
