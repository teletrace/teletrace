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

import (
	"encoding/json"
	"fmt"
	"github.com/teletrace/teletrace/pkg/model"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"testing"

	"github.com/stretchr/testify/assert"
)

// MOCKS

// request mocks
func getSearchRequestMock() (spansquery.SearchRequest, error) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    []any{"demo-client"},
				Operator: "in",
				Key:      "resource.attributes.service.name",
			},
		},
	}

	tf := model.Timeframe{
		StartTime: uint64(1684229780682000000),
		EndTime:   uint64(1684233409222000000),
	}

	sort := spansquery.Sort{
		Field:     "span.startTimeUnixNano",
		Ascending: false,
	}

	return spansquery.SearchRequest{
		Timeframe:     tf,
		Sort:          []spansquery.Sort{sort},
		SearchFilters: fs,
		Metadata: &spansquery.Metadata{
			NextToken: "",
		},
	}, nil
}

func getTagsValuesRequestMock() (tagsquery.TagValuesRequest, error) {
	tf := model.Timeframe{
		StartTime: uint64(1684234682230000000),
		EndTime:   uint64(1684238282230000000),
	}

	return tagsquery.TagValuesRequest{
		Timeframe:     &tf,
		SearchFilters: []model.SearchFilter{},
	}, nil
}

func getTagsStatisticsRequestMock() (tagsquery.TagStatisticsRequest, error) {
	tf := model.Timeframe{
		StartTime: uint64(1684229780682000000),
		EndTime:   uint64(1684233409222000000),
	}

	ts := []tagsquery.TagStatistic{
		"min", "max",
	}

	return tagsquery.TagStatisticsRequest{
		Timeframe:         &tf,
		DesiredStatistics: ts,
		SearchFilters:     []model.SearchFilter{},
	}, nil
}

func getTagsMappingsMock() []tagsquery.TagInfo {
	return []tagsquery.TagInfo{
		{
			Name: "span.status.code",
			Type: "Str",
		},
	}
}

// OpenSearch reqs
func getSearchOpenSearchReq() string {
	return `
    {
       "query":{
          "bool":{
             "must":[
                {
                   "bool":{
                      "should":[
                         {
                            "match_phrase":{
                               "resource.attributes.service.name":"demo-client"
                            }
                         }
                      ]
                   }
                },
                {
                   "range":{
                      "span.startTimeUnixNano":{
                         "gte":1684229780682
                      }
                   }
                },
                {
                   "range":{
                      "span.endTimeUnixNano":{
                         "lte":1684233409222
                      }
                   }
                }
             ]
          }
       },
       "size":50,
       "sort":[
          {
             "span.startTimeUnixNano":{
                "order":"desc"
             }
          },
          {
             "span.spanId.keyword":{
                "order":"asc"
             }
          }
       ]
    }
`
}

func getTagsValuesOpenSearchReq() string {
	return `
        {
            "aggregations":{
               "span.status.code":{
                  "terms":{
                     "field":"span.status.code.keyword",
                     "size":100
                  }
               }
            },
            "query":{
               "bool":{
                  "must":[
                     {
                        "range":{
                           "span.startTimeUnixNano":{
                              "gte":1684234682230
                           }
                        }
                     },
                     {
                        "range":{
                           "span.endTimeUnixNano":{
                              "lte":1684238282230
                           }
                        }
                     }
                  ]
               }
            },
            "size":0
}
    `
}

func getTagsStatisticsOpenSearchReq() string {
	return `
    {
       "aggregations":{
          "max":{
             "max":{
                "field":"externalFields.durationNano"
             }
          },
          "min":{
             "min":{
                "field":"externalFields.durationNano"
             }
          }
       },
       "query":{
          "bool":{
             "must":[
                {
                   "range":{
                      "span.startTimeUnixNano":{
                         "gte": 1684229780682
                      }
                   }
                },
                {
                   "range":{
                      "span.endTimeUnixNano":{
                         "lte": 1684233409222
                      }
                   }
                }
             ]
          }
       },
       "size":0
    }
    `
}

// TESTS

func TestBuildSort(t *testing.T) {
	sorts := []spansquery.Sort{
		{
			Field:     spansquery.SortField("resource.attributes.service.name"),
			Ascending: false,
		},
	}

	s := BuildSort(sorts)
	assert.Len(t, s, 2)
	assert.Equal(t, s, []Sort{
		map[string]SortField{
			"resource.attributes.service.name": {Order: "desc"},
		},
		map[string]SortField{
			TieBreakerField: {Order: "asc"}},
	})
}

func TestBuildTagsStatisticsAggs(t *testing.T) {
	tag := "externalFields.durationNano"
	ts := []tagsquery.TagStatistic{
		"min", "max",
	}

	aggs, err := BuildTagsStatisticsAggs(ts, tag)
	assert.Nil(t, err)
	assert.Len(t, aggs, 2)
	assert.Equal(t, aggs["max"].Max, &MaxAggregation{Field: &tag})
	assert.Equal(t, aggs["min"].Min, &MinAggregation{Field: &tag})
}

func TestBuildTagsValuesAggs(t *testing.T) {
	tm := getTagsMappingsMock()
	tag := tm[0].Name

	tv, err := BuildTagsValuesAggs(tm)

	assert.Nil(t, err)
	assert.Len(t, tv, 1)
	assert.Equal(t, *tv[tag].Terms, TermsAggregation{
		Field: fmt.Sprintf("%s.keyword", tag),
		Size:  100,
	})
}

// Build Filters Tests
func TestBuildFilters_NoFilters(t *testing.T) {
	qc, err := BuildFilters([]model.SearchFilter{})
	assert.Nil(t, err)
	assert.Nil(t, qc)
}

func TestBuildFilters_Equals(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "equals",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 1)
	assert.Len(t, qc.Bool.MustNot, 0)
	assert.Equal(t, qc.Bool.Must[0], QueryContainer{
		MatchPhrase: MatchPhrase{
			"resource.attributes.service.name": "demo-client",
		},
	})
}

func TestBuildFilters_NotEquals(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "not_equals",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 0)
	assert.Len(t, qc.Bool.MustNot, 1)
	assert.Equal(t, qc.Bool.MustNot[0], QueryContainer{
		MatchPhrase: MatchPhrase{
			"resource.attributes.service.name": "demo-client",
		},
	})
}

func TestBuildFilters_Contains(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "contains",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 1)
	assert.Len(t, qc.Bool.MustNot, 0)
	assert.Equal(t, qc.Bool.Must[0], QueryContainer{
		Wildcard: WildCard{
			"resource.attributes.service.name": WildCardQuery{
				Value: "*demo-client*",
			},
		},
	})
}

func TestBuildFilters_NotContains(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "not_contains",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 0)
	assert.Len(t, qc.Bool.MustNot, 1)
	assert.Equal(t, qc.Bool.MustNot[0], QueryContainer{
		Wildcard: WildCard{
			"resource.attributes.service.name": WildCardQuery{
				Value: "*demo-client*",
			},
		},
	})
}

func TestBuildFilters_Exists(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "exists",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 1)
	assert.Len(t, qc.Bool.MustNot, 0)
	assert.Equal(t, qc.Bool.Must[0], QueryContainer{
		Exists: &ExistsQuery{
			Field: "resource.attributes.service.name",
		},
	})
}

func TestBuildFilters_NotExists(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    "demo-client",
				Operator: "not_exists",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 0)
	assert.Len(t, qc.Bool.MustNot, 1)
	assert.Equal(t, qc.Bool.MustNot[0], QueryContainer{
		Exists: &ExistsQuery{
			Field: "resource.attributes.service.name",
		},
	})
}

func TestBuildFilters_In(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    []string{"demo-client"},
				Operator: "in",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 1)
	assert.Len(t, qc.Bool.MustNot, 0)
	assert.Equal(t, qc.Bool.Must[0], QueryContainer{
		Bool: &BoolQuery{
			Should: []QueryContainer{
				{
					MatchPhrase: MatchPhrase{
						"resource.attributes.service.name": "demo-client",
					},
				},
			},
		},
	})
}

func TestBuildFilters_NotIn(t *testing.T) {
	fs := []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Value:    []string{"demo-client"},
				Operator: "not_in",
				Key:      "resource.attributes.service.name",
			},
		},
	}
	qc, err := BuildFilters(fs)
	assert.Nil(t, err)
	assert.NotNil(t, qc)
	assert.Len(t, qc.Bool.Must, 0)
	assert.Len(t, qc.Bool.MustNot, 1)
	assert.Equal(t, qc.Bool.MustNot[0], QueryContainer{
		Bool: &BoolQuery{
			Should: []QueryContainer{
				{
					MatchPhrase: MatchPhrase{
						"resource.attributes.service.name": "demo-client",
					},
				},
			},
		},
	})
}

// Build Query Body Tests
func TestBuildQueryBody_Empty(t *testing.T) {
	var err error

	//nolint:ineffassign
	_ = BuildQueryBody()

	assert.Nil(t, err)
}

func TestBuildQueryBody_SearchRequest(t *testing.T) {
	reqMock, err := getSearchRequestMock()
	assert.Nil(t, err, nil)

	qc, err := BuildFiltersWithTimeFrame(reqMock.SearchFilters, &reqMock.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	assert.Nil(t, err, nil)

	osReq := BuildQueryBody(
		WithQuery(qc),
		WithSort(BuildSort(reqMock.Sort)),
		WithSize(50),
		WithSearchAfter([]string{}),
	)

	jsReq, err := json.Marshal(osReq)
	assert.Nil(t, err, nil)

	actualReq := getSearchOpenSearchReq()

	assert.JSONEq(t, string(jsReq), actualReq)
}

func TestBuildQueryBody_TagsValuesRequest(t *testing.T) {
	reqMock, err := getTagsValuesRequestMock()
	assert.Nil(t, err)

	qc, err := BuildFiltersWithTimeFrame(reqMock.SearchFilters, reqMock.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	assert.Nil(t, err)

	aggs, err := BuildTagsValuesAggs(getTagsMappingsMock())
	assert.Nil(t, err)

	osReq := BuildQueryBody(
		WithQuery(qc),
		WithAggregations(aggs),
	)

	jsReq, err := json.Marshal(osReq)
	assert.Nil(t, err)

	actualReq := getTagsValuesOpenSearchReq()

	assert.JSONEq(t, string(jsReq), actualReq)

}

func TestBuildQueryBody_TagsStatisticsRequest(t *testing.T) {
	reqMock, err := getTagsStatisticsRequestMock()
	assert.Nil(t, err)

	qc, err := BuildFiltersWithTimeFrame(reqMock.SearchFilters, reqMock.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	assert.Nil(t, err)

	aggs, err := BuildTagsStatisticsAggs(reqMock.DesiredStatistics, "externalFields.durationNano")
	assert.Nil(t, err)

	osReq := BuildQueryBody(
		WithQuery(qc),
		WithAggregations(aggs),
		WithSearchAfter([]string{}),
	)

	jsReq, err := json.Marshal(osReq)
	assert.Nil(t, err, nil)

	actualReq := getTagsStatisticsOpenSearchReq()

	assert.JSONEq(t, string(jsReq), actualReq)

}
