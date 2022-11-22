package model

type Timeframe struct {
	StartTime uint64 `json:"startTimeUnixNanoSec"`
	EndTime   uint64 `json:"endTimeUnixNanoSec"`
}

type ContinuationToken string

type Metadata struct {
	NextToken ContinuationToken `json:"nextToken"`
}

type FilterOperator string
type FilterKey string
type FilterValue any

type KeyValueFilter struct {
	Key      FilterKey      `json:"key"`
	Operator FilterOperator `json:"operator"`
	Value    FilterValue    `json:"value"`
}

type SearchFilter struct {
	KeyValueFilter *KeyValueFilter `json:"keyValueFilter"` // Optional, we might want other filter kinds in the future
}
