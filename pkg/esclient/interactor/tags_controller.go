package interactor

import (
	"context"
	"time"
)

type GetAvailableTagsRequest struct {
}

type GetAvailableTagsResult struct {
	Tags []TagInfo
}

type GetTagsValuesRequest struct {
	// A list od tags to get the values of
	Tags      []string

	// An optional lucene query to filter spans according to.
	Query     *string

	// The minimum time to search spans in
	StartTime time.Time

	// The maximum time to search span in
	EndTime   time.Time

	AutoPrefixTags *bool
}

type TagInfo struct {
	Name string
	Type string
}

type TagValueInfo struct {
	Value any
	Count int
}

// A mapping between a tag to an array of TagValueInfo
//
// e.g 
// ```json
// {
//   "tags": {
//     "http.status_code": [
//       { "value": 200, "count": 7 },
//       { "value": 500, "count": 2 },
//     ]
//     "http.url": [
//       { "value": "http://some.url", "count": 9 },
//     ]
//   }
// }
// ```
type GetTagsValuesResult struct {
	Tags map[string][]TagValueInfo
}

func NewGetTagsValueResult() GetTagsValuesResult {
	return GetTagsValuesResult {
		Tags: make(map[string][]TagValueInfo),
	}
}

type TagsController interface {
	GetAvailableTags(ctx context.Context, request GetAvailableTagsRequest) (GetAvailableTagsResult, error)
	GetTagsValues(ctx context.Context, request GetTagsValuesRequest) (GetTagsValuesResult, error)
}
