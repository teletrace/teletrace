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

package dsl

type QueryContainer struct {
	Bool     *Bool               `json:"bool,omitempty"`
	Wildcard map[string]WildCard `json:"wildcard,omitempty"`
	Range    map[string]Range    `json:"range,omitempty"`
	Exists   *Exists             `json:"exists,omitempty"`
}

type Bool struct {
	Must    []QueryContainer `json:"must,omitempty"`
	MustNot []QueryContainer `json:"must_not,omitempty`
	Should  []QueryContainer `json:"should,omitempty"`
	Filter  []QueryContainer `json:"filter,omitempty"`
}

type WildCard struct {
	Value string `json:"value"`
}

type Range struct {
	Gt  *float64 `json:"gt,omitempty"`
	Gte *float64 `json:"gte,omitempty"`
	Lt  *float64 `json:"lt,omitempty"`
	Lte *float64 `json:"lte,omitempty"`
}

type Exists struct {
	Field string `json:"field"`
}

type MatchPhrase map[any]string
