package tagscontroller

import (
	"bytes"
	"encoding/json"
	"oss-tracing/pkg/model/tagsquery/v1"
	"testing"

	"github.com/stretchr/testify/assert"
)

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
	uut := rawTagsController{}
	result, err := uut.parseGetTagsValuesResponseBody(body)
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
			Type: "keyword",
		},
		{
			Name: "span.attributes.http.method",
			Type: "text",
		},
		{
			Name: "span.attributes.http.method.not_keyword",
			Type: "keyword",
		},
	}

	tagsResult := removeDuplicatedTextTags(tagsMock)

	assert.Len(t, tagsResult, 2)

	var tagsNames []string
	for _, tag := range tagsResult {
		tagsNames = append(tagsNames, tag.Name)
	}

	assert.Contains(t, tagsNames, "span.attributes.http.method")
	assert.Contains(t, tagsNames, "span.attributes.http.method.not_keyword")
}
