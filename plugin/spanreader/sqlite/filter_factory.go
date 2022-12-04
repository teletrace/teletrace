/**
 * Copyright 2022 Epsagon
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
