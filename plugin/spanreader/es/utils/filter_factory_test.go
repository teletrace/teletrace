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

package utils

import (
	"encoding/json"
	"oss-tracing/pkg/model"
	"testing"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/stretchr/testify/assert"
)

func TestMustAndMustNotFilters(t *testing.T) {
	expectedJson := `{
	"bool": {
		"must": [
			{
				"bool": {
					"should": [
						{
							"match_phrase": {
								"resource.attributes.service.name": {
									"query": "demo-server"
								}
							}
						}
					]
				}
			}
		],
		"must_not": [
			{
				"bool": {
					"should": [
						{
							"match_phrase": {
								"span.name": {
									"query": "ExecuteRequest"
								}
							}
						}
					]
				}
			}
		]
	}
}`
	query := types.NewQueryContainerBuilder()
	kvFilters := []model.KeyValueFilter{
		{
			Key:      "resource.attributes.service.name",
			Operator: "in",
			Value:    []string{"demo-server"},
		},
		{
			Key:      "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
	}

	query, err := BuildFilters(query, kvFilters)
	assert.Nil(t, err)
	queryJson, err := json.Marshal(query.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson))
	// validate that filter orders doesn't effect
	query2 := types.NewQueryContainerBuilder()
	kvFilters2 := []model.KeyValueFilter{
		{
			Key:      "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
		{
			Key:      "resource.attributes.service.name",
			Operator: "in",
			Value:    []string{"demo-server"},
		},
	}

	query2, err = BuildFilters(query2, kvFilters2)
	assert.Nil(t, err)
	queryJson2, err := json.Marshal(query2.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson2))
}

func TestMultiMustNotFilters(t *testing.T) {
	expectedJson := `{
	"bool": {
		"must_not": [
			{
				"bool": {
					"should": [
						{
							"match_phrase": {
								"resource.attributes.service.name": {
									"query": "demo-server"
								}
							}
						}
					]
				}
			},
			{
				"bool": {
					"should": [
						{
							"match_phrase": {
								"span.name": {
									"query": "ExecuteRequest"
								}
							}
						}
					]
				}
			}
		]
	}
}`
	query := types.NewQueryContainerBuilder()
	kvFilters := []model.KeyValueFilter{
		{
			Key:      "resource.attributes.service.name",
			Operator: "not_in",
			Value:    []string{"demo-server"},
		},
		{
			Key:      "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
	}

	query, err := BuildFilters(query, kvFilters)
	assert.Nil(t, err)
	queryJson, err := json.Marshal(query.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson))
}
