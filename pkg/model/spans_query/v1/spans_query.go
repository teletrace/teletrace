package model

import (
	v1 "oss-tracing/pkg/model/internal_span/v1"
	"time"
)

type Timeframe struct {
	StartTime time.Time
	EndTime   time.Time
}

type SortField struct {
	Field     string
	Direction int
}

type SearchFilter struct {
	Key         string
	Operator    string
	Value       any
	QueryString string
}

type RequestMetadata struct {
	NextToken string
}

type SearchRequest struct {
	Timeframe       *Timeframe
	SortField       *SortField
	SearchFilter    []*SearchFilter
	RequestMetadata *RequestMetadata
}

type ResponseMetadata struct {
	NextToken string
}

type SearchResponse struct {
	ResponseMetadata *ResponseMetadata
	Spans            []*v1.ExtractedSpan
}
