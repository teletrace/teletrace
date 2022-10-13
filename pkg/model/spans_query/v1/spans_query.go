package model

import (
	v1 "oss-tracing/pkg/model/internal_span/v1"
	"time"
)

type SortField string
type FilterOperator string
type FilterKey string
type FilterValue any
type FilterQueryString string
type ContinuationToken string

type Timeframe struct {
	StartTime time.Time
	EndTime   time.Time
}

type Sort struct {
	Field     SortField
	Ascending bool
}

type SearchFilter struct {
	Key         FilterKey
	Operator    FilterOperator
	Value       FilterValue
	QueryString ContinuationToken
}

type Metadata struct {
	NextToken ContinuationToken
}

type SearchRequest struct {
	Timeframe       *Timeframe
	Sort            []*Sort
	SearchFilter    []*SearchFilter
	RequestMetadata *Metadata
}

type SearchResponse struct {
	ResponseMetadata *Metadata
	Spans            []*v1.InternalSpan
}
