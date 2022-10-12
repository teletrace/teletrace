package rawreqinteractor

import (
	"bytes"
	"encoding/json"
	"oss-tracing/pkg/esclient/interactor"
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
		 "http.flavor.keyword": {
		  "buckets": [
		   {
			"doc_count": 6,
			"key": "1.0"
		   }
		  ],
		  "doc_count_error_upper_bound": 0,
		  "sum_other_doc_count": 0
		 },
		 "http.method.keyword": {
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
		 "http.status_code": {
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
	uut := rawTagsController {}
	result, err := uut.parseGetTagsValuesResponseBody(body)
	if err != nil {
		t.Fatal(err)
	}

	// Assert
	assert.Len(t, result.Tags, 3)
	assert.Contains(t, result.Tags, "http.method.keyword")
	assert.Contains(t, result.Tags, "http.flavor.keyword")
	assert.Contains(t, result.Tags, "http.status_code")

	assertTag := func (tag string, expectedInfos []interactor.TagValueInfo) {
		assert.Contains(t, result.Tags, tag)
		assert.ElementsMatch(t, result.Tags[tag], expectedInfos)
	}

	assertTag("http.method.keyword", []interactor.TagValueInfo {{
		Value: "GET",
		Count: 4,
	}, {
		Value: "POST",
		Count: 1,
	}, {
		Value: "DELETE",
		Count: 1,
	}})

	assertTag("http.flavor.keyword", []interactor.TagValueInfo {{
		Value: "1.0",
		Count: 6,
	}})

	assertTag("http.status_code", []interactor.TagValueInfo {{
		Value: "200",
		Count: 3,
	}, {
		Value: "404",
		Count: 2,
	}, {
		Value: "500",
		Count: 1,
	}})
}
