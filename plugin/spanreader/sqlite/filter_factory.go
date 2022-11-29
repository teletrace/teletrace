package sqlite

import (
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

func BuildFilters(fs ...model.KeyValueFilter) {
	var sqliteOperators = map[string]string{
		spansquery.OPERATOR_EQUALS:       "=",
		spansquery.OPERATOR_NOT_EQUALS:   "!=",
		spansquery.OPERATOR_CONTAINS:     "LIKE",
		spansquery.OPERATOR_NOT_CONTAINS: "NOT LIKE",
		spansquery.OPERATOR_EXISTS:       "IS NOT NULL",
		spansquery.OPERATOR_NOT_EXISTS:   "IS NULL",
		spansquery.OPERATOR_IN:           "IN",
		spansquery.OPERATOR_NOT_IN:       "NOT IN",
		spansquery.OPERATOR_GT:           ">",
		spansquery.OPERATOR_GTE:          ">=",
		spansquery.OPERATOR_LT:           "<",
		spansquery.OPERATOR_LTE:          "<=",
	}

	// var query string = "SELECT * FROM spans WHERE "

	for _, f := range fs {
		if _, ok := sqliteOperators[string(f.Operator)]; !ok {
			continue
		}
		// query += f.Key + " " + sqliteOperators[string(f.Operator)] + " " + f.Value;

	}

}
