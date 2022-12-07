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

package model

type Timeframe struct {
	StartTime uint64 `json:"startTimeUnixNanoSec"`
	EndTime   uint64 `json:"endTimeUnixNanoSec"`
}

type ContinuationToken string

type Metadata struct {
	NextToken ContinuationToken `json:"nextToken"`
}

type (
	FilterOperator string
	FilterKey      string
	FilterValue    any
)

type KeyValueFilter struct {
	Key      FilterKey      `json:"key"`
	Operator FilterOperator `json:"operator"`
	Value    FilterValue    `json:"value"`
}

type SearchFilter struct {
	KeyValueFilter *KeyValueFilter `json:"keyValueFilter"` // Optional, we might want other filter kinds in the future
}
