package model

import "fmt"

type GetAvailableTagsRequest struct {
}

type GetAvailableTagsResult struct {
	Tags []TagInfo
}

type GetTagsValuesRequest struct {
	// A list od tags to get the values of
	Tags []string

	// An optional lucene query to filter spans according to.
	// e.g: "span.attributes.http.status_code: 200"
	Query *string

	Timeframe Timeframe `json:"timeframe"`

	AutoPrefixTags *bool
}

type TagInfo struct {
	// The tag's name
	// e.g "http.status_code"
	Name string

	// The tag's type
	// e.g "string"
	Type string
}

type TagValueInfo struct {
	// The value, can be of any type
	Value any

	// The appearance count of this value
	Count int
}

// A mapping between a tag to an array of TagValueInfo
//
// e.g
// ```json
//
//	{
//	  "tags": {
//	    "http.status_code": [
//	      { "value": 200, "count": 7 },
//	      { "value": 500, "count": 2 },
//	    ]
//	    "http.url": [
//	      { "value": "http://some.url", "count": 9 },
//	    ]
//	  }
//	}
//
// ```
type GetTagsValuesResult struct {
	Tags map[string][]TagValueInfo
}

func (r *GetTagsValuesRequest) Validate() error {
	if r.Timeframe.EndTime < r.Timeframe.StartTime {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}

func NewGetTagsValueResult() GetTagsValuesResult {
	return GetTagsValuesResult{
		Tags: make(map[string][]TagValueInfo),
	}
}
