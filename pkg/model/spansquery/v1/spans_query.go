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

package model

import (
	"fmt"
	"oss-tracing/pkg/model"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"
)

const (
	OPERATOR_EQUALS       = "equals"
	OPERATOR_NOT_EQUALS   = "not_equals"
	OPERATOR_IN           = "in"
	OPERATOR_NOT_IN       = "not_in"
	OPERATOR_CONTAINS     = "contains"
	OPERATOR_NOT_CONTAINS = "not_contains"
	OPERATOR_EXISTS       = "exists"
	OPERATOR_NOT_EXISTS   = "not_exists"
	OPERATOR_GT           = "gt"
	OPERATOR_GTE          = "gte"
	OPERATOR_LT           = "lt"
	OPERATOR_LTE          = "lte"
)

type (
	SortField         string
	FilterQueryString string
	ContinuationToken string
)

type Sort struct {
	Field     SortField `json:"field"`
	Ascending bool      `json:"ascending"`
}

type Metadata struct {
	NextToken ContinuationToken `json:"nextToken"`
}

type SearchRequest struct {
	Timeframe     model.Timeframe      `json:"timeframe"`
	Sort          []Sort               `json:"sort" default:"[{\"Field\": \"TimestampUnixMilli\", \"Ascending\": false}]"`
	SearchFilters []model.SearchFilter `json:"filters"`
	Metadata      *Metadata            `json:"metadata"`
}

type SearchResponse struct {
	Metadata *Metadata                    `json:"metadata"`
	Spans    []*internalspan.InternalSpan `json:"spans"`
}

func (sr *SearchRequest) Validate() error {
	if (sr.Timeframe.EndTime < sr.Timeframe.StartTime) && (sr.Timeframe.EndTime != 0) {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}
