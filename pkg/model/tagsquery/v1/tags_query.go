package tagsquery

import (
	"fmt"
	"oss-tracing/pkg/model"
)

type TagValuesRequest struct {
	Timeframe model.Timeframe `json:"timeframe"`
	SearchFilters []model.SearchFilter  `json:"filters"`
}

func (r *TagValuesRequest) Validate() error {
	if r.Timeframe.EndTime < r.Timeframe.StartTime {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}

type TagValueInfo struct {
	Value any `json:"value"`
	Count int `json:"count"`
}

type TagValuesResponse struct {
	Metadata *model.Metadata `json:"metadata"`
	Values   []TagValueInfo  `json:"values"`
}

type GetAvailableTagsRequest struct {
}

type GetAvailableTagsResponse struct {
	Tags []TagInfo
}

type TagInfo struct {
	// The tag's name
	// e.g "http.status_code"
	Name string `json:"name"`

	// The tag's type
	// e.g "string"
	Type string `json:"type"`
}
