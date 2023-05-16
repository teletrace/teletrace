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

type (
	MatchPhrase map[string]any
	WildCard    map[string]WildCardQuery
	Range       map[string]RangeQuery
	Sort        map[string]SortField
	SearchAfter []string
)

type Body struct {
	Query        *QueryContainer                  `json:"query,omitempty"`
	Aggregations map[string]AggregationsContainer `json:"aggregations,omitempty"`
	Sorts        []Sort                           `json:"sort,omitempty"`
	SearchAfter  SearchAfter                      `json:"search_after,omitempty"`
	Size         int                              `json:"size"`
}

type QueryContainer struct {
	Bool        *BoolQuery   `json:"bool,omitempty"`
	Wildcard    WildCard     `json:"wildcard,omitempty"`
	Range       Range        `json:"range,omitempty"`
	Exists      *ExistsQuery `json:"exists,omitempty"`
	MatchPhrase MatchPhrase  `json:"match_phrase,omitempty"`
}

type BoolQuery struct {
	Must    []QueryContainer `json:"must,omitempty"`
	MustNot []QueryContainer `json:"must_not,omitempty"`
	Should  []QueryContainer `json:"should,omitempty"`
	Filter  []QueryContainer `json:"filter,omitempty"`
}

type WildCardQuery struct {
	Value string `json:"value"`
}

type RangeQuery struct {
	Gt  *float64 `json:"gt,omitempty"`
	Gte *float64 `json:"gte,omitempty"`
	Lt  *float64 `json:"lt,omitempty"`
	Lte *float64 `json:"lte,omitempty"`
}

type ExistsQuery struct {
	Field string `json:"field"`
}

type AggregationsContainer struct {
	Aggregations map[string]AggregationsContainer `json:"aggregations,omitempty"`
	Min          *MinAggregation                  `json:"min,omitempty"`
	Max          *MaxAggregation                  `json:"max,omitempty"`
	Avg          *AverageAggregation              `json:"avg,omitempty"`
	Percentiles  *PercentilesAggregation          `json:"percentiles,omitempty"`
	Terms        *TermsAggregation                `json:"terms,omitempty"`
}

type PercentilesAggregation struct {
	Field *string `json:"field,omitempty"`
}

type MinAggregation struct {
	Field *string `json:"field,omitempty"`
}

type MaxAggregation struct {
	Field *string `json:"field,omitempty"`
}

type AverageAggregation struct {
	Field *string `json:"field,omitempty"`
}

type TermsAggregation struct {
	Field string `json:"field,omitempty"`
	Size  int    `json:"size,omitempty"`
}

type SortField struct {
	Order string `json:"order"`
}
