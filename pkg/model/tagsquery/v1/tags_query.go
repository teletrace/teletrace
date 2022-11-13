package tagsquery

import (
	"fmt"
	"oss-tracing/pkg/model"
)

type TagValuesRequest struct {
	Timeframe model.Timeframe `json:"timeframe"`
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
