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

package sqlitespanreader

import (
	"fmt"
	"oss-tracing/pkg/model"

	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type extractOrderResponse struct {
	filter  model.SearchFilter
	sortTag string
	sortBy  string
}

func (er *extractOrderResponse) getFilter() model.SearchFilter {
	return er.filter
}

func (er *extractOrderResponse) getSortTag() string {
	return er.sortTag
}

func (er *extractOrderResponse) getSortBy() string {
	return er.sortBy
}

func extractNextToken(orders []spansquery.Sort, nextToken spansquery.ContinuationToken) (*extractOrderResponse, error) {
	if len(orders) > 1 {
		return nil, fmt.Errorf("expected a single sort field, but found: %v", len(orders))
	}
	order := orders[0]
	sqliteOrder, err := newSqliteOrder(order)
	if err != nil {
		return nil, fmt.Errorf("failed to parse order: %v", err)
	}
	var filter model.SearchFilter
	if (nextToken) != "" {
		switch sqliteOrder.orderBy {
		case "DESC":
			filter = newSearchFilter(fmt.Sprintf("%s.%s", sqliteOrder.getTableKey(), sqliteOrder.getTag()), spansquery.OPERATOR_LT, nextToken)
		case "ASC":
			filter = newSearchFilter(fmt.Sprintf("%s.%s", sqliteOrder.getTableKey(), sqliteOrder.getTag()), spansquery.OPERATOR_GT, nextToken)
		}
		if filter.KeyValueFilter == nil {
			return nil, fmt.Errorf("failed to create filter from order: %v", order)
		}
	}
	if err != nil {
		return nil, fmt.Errorf("illegal tag name: %s", filter.KeyValueFilter.Key)
	}
	return &extractOrderResponse{
		filter:  filter,
		sortTag: sqliteFieldsMap[fmt.Sprintf("%s.%s", sqliteOrder.getTableKey(), sqliteOrder.getTag())],
		sortBy:  sqliteOrder.getOrderBy(),
	}, nil
}
