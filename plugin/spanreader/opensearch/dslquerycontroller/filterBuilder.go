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
	"strconv"

	"github.com/teletrace/teletrace/pkg/model"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
)

type FilterParseOption func(*model.KeyValueFilter)

func BuildFilters(fs []model.KeyValueFilter, opts ...FilterParseOption) (*QueryContainer, error) {
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
			must = append(must, *qc)
		} else {
			mustNot = append(mustNot, *qc)
		}
	}

	qc := QueryContainer{}
	if len(must) == 0 && len(mustNot) == 0 {
		return nil, nil
	}

	qc.Bool = &Bool{
		Must:    must,
		MustNot: mustNot,
	}

	return &qc, nil
}

func createEqualsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	m := MatchPhraseType{}

	m[string(f.Key)] = fmt.Sprintf("%+v", f.Value)

	qc := QueryContainer{}
	qc.MatchPhrase = m
	return &qc, nil
}

func createInFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	var shouldQueriesArray []MatchPhraseType

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
		m := MatchPhraseType{}

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
	qc.Bool = &Bool{
		Should: qcSlice,
	}

	return &qc, nil
}

func createContainsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	qc := QueryContainer{}

	m := WildCardType{}

	m[string(f.Key)] = WildCard{
		Value: (fmt.Sprintf("*%+v*", f.Value)),
	}

	qc.Wildcard = m

	return &qc, nil
}

func createExistsFilter(f model.KeyValueFilter) (*QueryContainer, error) {
	qc := QueryContainer{}
	qc.Exists = &Exists{
		Field: string(f.Key),
	}
	return &qc, nil
}

func createRangeFilter(f model.KeyValueFilter) (*QueryContainer, error) { // also handle GTE / GT / LTE / LT
	qc := QueryContainer{}

	m := RangeType{}

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

	r := Range{}

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

func WithMilliSecTimestampAsNanoSec() FilterParseOption {
	return func(f *model.KeyValueFilter) {
		if IsConvertedTimestamp(f.Key) {
			switch castValue := f.Value.(type) {
			case float64:
				f.Value = NanoToMilliFloat64(castValue)
			case uint64:
				f.Value = NanoToMilliUint64(castValue)
			}
		}
	}
}
