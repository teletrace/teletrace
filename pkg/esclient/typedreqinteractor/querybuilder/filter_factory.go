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
			b, err = createContainsFilter(f)
		case spansquery.OPERATOR_NOT_CONTAINS:
			b, err = createContainsFilter(f)
		case spansquery.OPERATOR_EXISTS:
			b, err = createExistsFilter(f)
		case spansquery.OPERATOR_NOT_EXISTS:
			b, err = createExistsFilter(f)
		case spansquery.OPERATOR_GT:
			b, err = createRangeFilter(f)
		case spansquery.OPERATOR_GTE:
			b, err = createRangeFilter(f)
		case spansquery.OPERATOR_LT:
			b, err = createRangeFilter(f)
		case spansquery.OPERATOR_LTE:
			b, err = createRangeFilter(f)
		}

		if err != nil {
			return nil, fmt.Errorf("Could not create filter from: %+v: %+v", f, err)
		}
	}

	return b.Bool(types.NewBoolQueryBuilder().
		MustNot(mustNot).Must(must),
	), nil

}

func createRangeFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) { // also handle GTE / GT / LTE / LT
	return nil, nil
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
	return nil, nil
}

func createExistsFilter(f spansquery.KeyValueFilter) (*types.QueryContainerBuilder, error) {
	return nil, nil
}
