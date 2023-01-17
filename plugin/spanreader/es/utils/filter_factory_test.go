package utils

import (
	"encoding/json"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/stretchr/testify/assert"
	"oss-tracing/pkg/model"
	"testing"
)

func TestMustAndNotMustFilters(t *testing.T) {
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
		{Key: "resource.attributes.service.name",
			Operator: "in",
			Value:    []string{"demo-server"},
		},
		{Key: "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
	}

	query, err := BuildFilters(query, kvFilters, WithMiliSecTimestampAsNanoSec())
	assert.Nil(t, err)
	queryJson, err := json.Marshal(query.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson))
	//validate that filter orders doesn't effect
	query2 := types.NewQueryContainerBuilder()
	kvFilters2 := []model.KeyValueFilter{
		{Key: "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
		{Key: "resource.attributes.service.name",
			Operator: "in",
			Value:    []string{"demo-server"},
		},
	}

	query2, err = BuildFilters(query2, kvFilters2, WithMiliSecTimestampAsNanoSec())
	assert.Nil(t, err)
	queryJson2, err := json.Marshal(query2.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson2))
}

func TestMultiNotMustFilters(t *testing.T) {
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
		{Key: "resource.attributes.service.name",
			Operator: "not_in",
			Value:    []string{"demo-server"},
		},
		{Key: "span.name",
			Operator: "not_in",
			Value:    []string{"ExecuteRequest"},
		},
	}

	query, err := BuildFilters(query, kvFilters, WithMiliSecTimestampAsNanoSec())
	assert.Nil(t, err)
	queryJson, err := json.Marshal(query.Build())
	assert.Nil(t, err)
	assert.JSONEq(t, expectedJson, string(queryJson))
}
