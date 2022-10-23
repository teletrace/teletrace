package querybuilder

import (
	"encoding/json"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

func BuildFilters(b *types.QueryContainerBuilder, fs ...spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	var must []types.QueryContainer
	var mustNot []types.QueryContainer

	for _, f := range fs {

		var err error
		switch op := f.Operator; string(op) {
		case spansquery.OPERATOR_EQUALS:
			qc, err := createEqualsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			must = append(must, (*qc).Build())
		case spansquery.OPERATOR_NOT_EQUALS:
			qc, err := createEqualsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			mustNot = append(mustNot, (*qc).Build())
		case spansquery.OPERATOR_IN:
			qc, err := createInFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			must = append(must, (*qc).Build())
		case spansquery.OPERATOR_NOT_IN:
			qc, err := createInFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			mustNot = append(mustNot, (*qc).Build())
		case spansquery.OPERATOR_CONTAINS:
			qc, err := createContainsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			must = append(must, (*qc).Build())
		case spansquery.OPERATOR_NOT_CONTAINS:
			qc, err := createContainsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			mustNot = append(mustNot, (*qc).Build())
		case spansquery.OPERATOR_EXISTS:
			qc, err := createExistsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			must = append(must, (*qc).Build())
		case spansquery.OPERATOR_NOT_EXISTS:
			qc, err := createExistsFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			mustNot = append(mustNot, (*qc).Build())
		case spansquery.OPERATOR_GT, spansquery.OPERATOR_GTE, spansquery.OPERATOR_LTE, spansquery.OPERATOR_LT:
			qc, err := createRangeFilter(f)
			if err != nil {
				return nil, fmt.Errorf("Could not build %s filter: %+v", f.Operator, err)
			}

			must = append(must, (*qc).Build())
		default:
			return nil, fmt.Errorf("Could not parse operator: %s", f.Operator)
		}

		if err != nil {
			return nil, fmt.Errorf("Could not create filter from: %+v: %+v", f, err)
		}
	}

	return b.Bool(types.NewBoolQueryBuilder().
		MustNot(mustNot).Must(must),
	), nil

}

func createEqualsFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.MatchPhraseQueryBuilder{}

	m[types.Field(f.Key)] = types.NewMatchPhraseQueryBuilder().Query(fmt.Sprintf("%+v", f.Value)) // TODO hacky, should be better typing with PB request

	return qc.MatchPhrase(m), nil
}

func createInFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
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

func createContainsFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.WildcardQueryBuilder{}

	m[types.Field(f.Key)] = types.NewWildcardQueryBuilder().Value(fmt.Sprintf("*%+v*", f.Value))

	return qc.Wildcard(m), nil
}

func createExistsFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	qc := types.NewQueryContainerBuilder()

	return qc.Exists(types.NewExistsQueryBuilder().Field(types.Field(f.Key))), nil
}

func createRangeFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) { // also handle GTE / GT / LTE / LT
	qc := types.NewQueryContainerBuilder()

	m := map[types.Field]*types.RangeQueryBuilder{}

	var fVal float64

	if i, ok := f.Value.(int64); ok {
		fVal = float64(i)
	} else if fl, ok := f.Value.(float64); ok {
		fVal = fl
	} else {
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
