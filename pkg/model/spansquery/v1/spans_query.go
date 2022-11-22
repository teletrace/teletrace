package model

import (
	"fmt"
	"oss-tracing/pkg/model"
	internalspan "oss-tracing/pkg/model/internalspan/v1"
)

const (
	OPERATOR_EQUALS       = "equals"
	OPERATOR_NOT_EQUALS   = "not_equals"
	OPERATOR_IN           = "in"
	OPERATOR_NOT_IN       = "not_in"
	OPERATOR_CONTAINS     = "contains"
	OPERATOR_NOT_CONTAINS = "not_contains"
	OPERATOR_EXISTS       = "exists"
	OPERATOR_NOT_EXISTS   = "not_exists"
	OPERATOR_GT           = "gt"
	OPERATOR_GTE          = "gte"
	OPERATOR_LT           = "lt"
	OPERATOR_LTE          = "lte"
)

type SortField string
type FilterQueryString string
type ContinuationToken string

type Sort struct {
	Field     SortField `json:"field"`
	Ascending bool      `json:"ascending"`
}


type Metadata struct {
	NextToken ContinuationToken `json:"nextToken"`
}

type SearchRequest struct {
	Timeframe     model.Timeframe `json:"timeframe"`
	Sort          []Sort          `json:"sort" default:"[{\"Field\": \"TimestampNano\", \"Ascending\": false}]"`
	SearchFilters []model.SearchFilter  `json:"filters"`
	Metadata      *Metadata       `json:"metadata"`
}

type SearchResponse struct {
	Metadata *Metadata                    `json:"metadata"`
	Spans    []*internalspan.InternalSpan `json:"spans"`
}

func (sr *SearchRequest) Validate() error {
	if sr.Timeframe.EndTime < sr.Timeframe.StartTime {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}
