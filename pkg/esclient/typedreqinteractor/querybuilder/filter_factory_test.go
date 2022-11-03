package querybuilder

import (
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"

	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildFilters(t *testing.T) {
	testCases := []struct {
		name           string
		filters        []spansquery.KeyValueFilter
		hasError       bool
		expectedResult *types.QueryContainerBuilder
	}{
		{
			"Test No Filters",
			nil,
			false,
			types.NewQueryContainerBuilder().Bool(types.NewBoolQueryBuilder().MustNot(nil).Must(nil)),
		},
		{
			"Test Invalid operator filter",
			[]spansquery.KeyValueFilter{{"key", "IN", "banana"}},
			true,
			nil,
		},
		{
			"Test Invalid IN filter",
			[]spansquery.KeyValueFilter{{"key", "in", "banana"}},
			true,
			nil,
		},
		{
			"Test Invalid numerical filter",
			[]spansquery.KeyValueFilter{{"key", "gt", "banana"}},
			true,
			nil,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			query := types.NewQueryContainerBuilder()

			res, err := BuildFilters(query, tc.filters...)
			if tc.hasError {
				assert.Error(t, err)
			} else {
				assert.Equal(
					t,
					tc.expectedResult.Build(),
					res.Build(),
				)
			}
		})
	}
}
