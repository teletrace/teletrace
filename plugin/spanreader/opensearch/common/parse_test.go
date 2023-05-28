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

package common

import (
	"bytes"
	"encoding/json"
	"testing"

	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"go.opentelemetry.io/collector/pdata/pcommon"

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
                "_index":"teletrace-traces",
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
                      "Kind":"Internal",
                      "Links":null,
                      "Name":"span_name",
                      "ParentSpanId":"00000000",
                      "SpanId":"12345678",
                      "StartTimeUnixNano":0,
                      "Status":{
                         "Code":"Unset",
                         "Message":"STATUS_MESSAGE"
                      },
                      "TraceId":"1234567887654321",
                      "TraceState":"state"
                   }
                },
				"sort": ["12345678"]
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

func TestParseSpansResponse(t *testing.T) {
	res, err := getSearchResponseMock()

	assert.Nil(t, err)

	//nolint:ineffassign
	spans, err := ParseSpansResponse(res)

	expectedNextToken := "[\"12345678\"]"
	assert.Len(t, spans.Spans, 1)
	assert.NotNil(t, spans.Metadata)
	assert.Equal(t, spans.Metadata.NextToken, spansquery.ContinuationToken(expectedNextToken))
	assert.Nil(t, err)
}

func Test_ParseGetTagsValuesResponseBody_ValidResponse(t *testing.T) {
	// Arrange
	// Elastic search response
	responseContent := `
	{
		"_shards": {
		 "failed": 0,
		 "skipped": 0,
		 "successful": 1,
		 "total": 1
		},
		"aggregations": {
		 "span.attributes.http.flavor.keyword": {
		  "buckets": [
		   {
			"doc_count": 6,
			"key": "1.0"
		   }
		  ],
		  "doc_count_error_upper_bound": 0,
		  "sum_other_doc_count": 0
		 },
		 "span.attributes.http.method.keyword": {
		  "buckets": [
		   {
			"doc_count": 4,
			"key": "GET"
		   },
		   {
			"doc_count": 1,
			"key": "DELETE"
		   },
		   {
			"doc_count": 1,
			"key": "POST"
		   }
		  ],
		  "doc_count_error_upper_bound": 0,
		  "sum_other_doc_count": 0
		 },
		 "span.attributes.http.status_code": {
		  "buckets": [
		   {
			"doc_count": 3,
			"key": 200
		   },
		   {
			"doc_count": 2,
			"key": 404
		   },
		   {
			"doc_count": 1,
			"key": 500
		   }
		  ],
		  "doc_count_error_upper_bound": 0,
		  "sum_other_doc_count": 0
		 }
		},
		"hits": {
		 "hits": [],
		 "max_score": null,
		 "total": {
		  "relation": "eq",
		  "value": 6
		 }
		},
		"timed_out": false,
		"took": 6
	}
	`

	buffer := bytes.NewBufferString(responseContent)
	body := make(map[string]any)
	_ = json.NewDecoder(buffer).Decode(&body)

	// Act
	result, err := ParseGetTagsValuesResponseBody(body)
	if err != nil {
		t.Fatal(err)
	}

	// Assert
	assert.Len(t, result, 3)
	assert.Contains(t, result, "span.attributes.http.method.keyword")
	assert.Contains(t, result, "span.attributes.http.flavor.keyword")
	assert.Contains(t, result, "span.attributes.http.status_code")

	assertTag := func(tag string, expectedInfos tagsquery.TagValuesResponse) {
		assert.Contains(t, result, tag)
		assert.ElementsMatch(t, result[tag].Values, expectedInfos.Values)
	}

	assertTag(
		"span.attributes.http.method.keyword",
		tagsquery.TagValuesResponse{
			Values: []tagsquery.TagValueInfo{{
				Value: "GET",
				Count: 4,
			}, {
				Value: "POST",
				Count: 1,
			}, {
				Value: "DELETE",
				Count: 1,
			}},
		},
	)

	assertTag(
		"span.attributes.http.flavor.keyword",
		tagsquery.TagValuesResponse{
			Values: []tagsquery.TagValueInfo{
				{
					Value: "1.0",
					Count: 6,
				},
			},
		},
	)

	assertTag(
		"span.attributes.http.status_code",
		tagsquery.TagValuesResponse{
			Values: []tagsquery.TagValueInfo{
				{
					Value: float64(200),
					Count: 3,
				},
				{
					Value: float64(404),
					Count: 2,
				},
				{
					Value: float64(500),
					Count: 1,
				},
			},
		},
	)
}

func Test_RemoveDuplicatedTextTags_RemoveTextDuplicates(t *testing.T) {
	tagsMock := []tagsquery.TagInfo{
		{
			Name: "span.attributes.http.method.keyword",
			Type: pcommon.ValueTypeStr.String(),
		},
		{
			Name: "span.attributes.http.method",
			Type: pcommon.ValueTypeStr.String(),
		},
		{
			Name: "span.attributes.http.method.not_keyword",
			Type: pcommon.ValueTypeStr.String(),
		},
	}

	tagsResult := RemoveDuplicatedTextTags(tagsMock)

	assert.Len(t, tagsResult, 2)

	var tagsNames []string
	for _, tag := range tagsResult {
		tagsNames = append(tagsNames, tag.Name)
	}

	assert.Contains(t, tagsNames, "span.attributes.http.method")
	assert.Contains(t, tagsNames, "span.attributes.http.method.not_keyword")
}
