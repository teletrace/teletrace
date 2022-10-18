package querybuilder

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

func createRangeFilterBuilder(f *interactor.SearchFilter) (*types.RangeQueryBuilder, error) { // also handle GTE / GT / LTE / LT

}

func createEqualsFilterBuilder(f *interactor.SearchFilter) (*types.MatchPhraseQueryBuilder, error) {

}

func createInFilterBuilder(f *interactor.SearchFilter) (*types.BoolQueryBuilder, error) {

}

func createContainsFilterBuilder(f *interactor.SearchFilter) (*types.BoolQueryBuilder, error) {

}

func createExistsFilterBuilder(f *interactor.SearchFilter) (*types.ExistsQueryBuilder, error) {

}
