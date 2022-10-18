package querybuilder

import (
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

func BuildFilters(b *types.QueryContainerBuilder, fs ...spansquery.SearchFilter) (*types.QueryContainerBuilder, error) {
	for _, f := range fs {

		var err error

		switch op := f.Operator; string(*op) {
		case spansquery.OPERATOR_EQUALS:
			b, err = createEqualsFilterBuilder(b, f)
		case spansquery.OPERATOR_NOT_EQUALS:
			b, err = createEqualsFilterBuilder(b, f)
		case spansquery.OPERATOR_IN:
			b, err = createInFilterBuilder(b, f)
		case spansquery.OPERATOR_NOT_IN:
			b, err = createInFilterBuilder(b, f)
		case spansquery.OPERATOR_CONTAINS:
			b, err = createContainsFilterBuilder(b, f)
		case spansquery.OPERATOR_NOT_CONTAINS:
			b, err = createContainsFilterBuilder(b, f)
		case spansquery.OPERATOR_EXISTS:
			b, err = createExistsFilterBuilder(b, f)
		case spansquery.OPERATOR_NOT_EXISTS:
			b, err = createExistsFilterBuilder(b, f)
		case spansquery.OPERATOR_GT:
			b, err = createRangeFilterBuilder(b, f)
		case spansquery.OPERATOR_GTE:
			b, err = createRangeFilterBuilder(b, f)
		case spansquery.OPERATOR_LT:
			b, err = createRangeFilterBuilder(b, f)
		case spansquery.OPERATOR_LTE:
			b, err = createRangeFilterBuilder(b, f)
		}

		if err != nil {
			return nil, fmt.Errorf("Could not create filter from: %+v: %+v", f, err)
		}
	}

	return b, nil
}

func createRangeFilterBuilder(b *types.QueryContainerBuilder, f spansquery.SearchFilter) (*types.QueryContainerBuilder, error) { // also handle GTE / GT / LTE / LT

}

func createEqualsFilterBuilder(b *types.QueryContainerBuilder, f spansquery.SearchFilter) (*types.QueryContainerBuilder, error) {

}

func createInFilterBuilder(b *types.QueryContainerBuilder, f spansquery.SearchFilter) (*types.QueryContainerBuilder, error) {

}

func createContainsFilterBuilder(b *types.QueryContainerBuilder, f spansquery.SearchFilter) (*types.QueryContainerBuilder, error) {

}

func createExistsFilterBuilder(b *types.QueryContainerBuilder, f spansquery.SearchFilter) (*types.QueryContainerBuilder, error) {

}
