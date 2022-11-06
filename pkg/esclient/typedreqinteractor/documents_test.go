package typedreqinteractor

import (
	"encoding/json"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func getSearchResponseMock() (map[string]any, error) {
	var res map[string]any
	err := json.Unmarshal([]byte(`{
       "_shards":{
          "failed":0,
          "skipped":0,
          "successful":1,
          "total":1
       },
       "hits":{
          "hits":[
             {
                "_id":"Q8A5CIQBo5OYxCntcabF",
                "_index":"lupa-spans",
                "_score":1,
                "_source":{
                   "ExternalFields":{
                      "DurationNano":1000000000
                   },
                   "IngestionTimeUnixNano":0,
                   "Resource":{
                      "Attributes":{
                         "intValue":1666585293167,
                         "stringValue":"str"
                      },
                      "DroppedAttributesCount":0
                   },
                   "Scope":{
                      "Attributes":{
                         "intValue":1666585293167,
                         "stringValue":"str"
                      },
                      "DroppedAttributesCount":0,
                      "Name":"scope",
                      "Version":"version"
                   },
                   "Span":{
                      "Attributes":{
                         "intValue":1666585293167,
                         "stringValue":"str"
                      },
                      "DroppedAttributesCount":0,
                      "DroppedEventsCount":0,
                      "DroppedLinksCount":0,
                      "EndTimeUnixNano":167945000,
                      "Events":null,
                      "Kind":1,
                      "Links":null,
                      "Name":"span_name",
                      "ParentSpanId":[
                         0,
                         0,
                         0,
                         0,
                         0,
                         0,
                         0,
                         0
                      ],
                      "SpanId":[
                         1,
                         2,
                         3,
                         4,
                         5,
                         6,
                         7,
                         8
                      ],
                      "StartTimeUnixNano":0,
                      "Status":{
                         "Code":0,
                         "Message":"STATUS_MESSAGE"
                      },
                      "TraceId":[
                         1,
                         2,
                         3,
                         4,
                         5,
                         6,
                         7,
                         8,
                         8,
                         7,
                         6,
                         5,
                         4,
                         3,
                         2,
                         1
                      ],
                      "TraceState":"state"
                   }
                }
             }
          ],
          "max_score":1,
          "total":{
             "relation":"eq",
             "value":1
          }
       },
       "timed_out":false,
       "took":1
    }`), &res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func getSearchRequestMock(fs ...spansquery.SearchFilter) (spansquery.SearchRequest, error) {
	tf := spansquery.Timeframe{
		StartTime: uint64(time.Unix(0, 0).UnixNano()),
		EndTime:   uint64(time.Now().UnixNano()),
	}

	sort := spansquery.Sort{
		Field:     "TimestampNano",
		Ascending: false,
	}

	return spansquery.SearchRequest{
		Timeframe:    tf,
		Sort:         []spansquery.Sort{sort}, // TODO add a function that creates the search request with defaults
		SearchFilter: fs,
	}, nil
}

func TestParseSpansResponse(t *testing.T) {
	res, err := getSearchResponseMock()

	assert.Nil(t, err)

	//nolint:ineffassign
	spans, err := parseSpansResponse(res)

	assert.Len(t, spans.Spans, 1)
	assert.Nil(t, err)
}

func TestBuildSearchRequest_NoFilters(t *testing.T) {
	var err error

	//nolint:ineffassign
	searchReq, err := getSearchRequestMock()

	assert.Nil(t, err)

	//nolint:ineffassign
	_, err = buildSearchRequest(&searchReq)

	assert.Nil(t, err)
}
