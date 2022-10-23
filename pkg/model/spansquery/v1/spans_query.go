package model

import (
	internalspan "oss-tracing/pkg/model/internalspan/v1"
	"time"
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

type KeyValueFilter struct {
	Key      FilterKey
	Operator FilterOperator
	Value    FilterValue
}

type SearchFilter struct {
	KeyValueFilter *KeyValueFilter    // Optional
	QueryString    *FilterQueryString // Optional
}

type Metadata struct {
	NextToken ContinuationToken
}

type SearchRequest struct {
	Timeframe       Timeframe
	Sort            []Sort
	SearchFilter    []SearchFilter
	RequestMetadata *Metadata
}

type SearchResponse struct {
	ResponseMetadata *Metadata
	Spans            []*internalspan.InternalSpan
}
