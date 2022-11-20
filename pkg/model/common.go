package model

type Timeframe struct {
	StartTime uint64 `json:"startTime"`
	EndTime   uint64 `json:"endTime"`
}

type ContinuationToken string

type Metadata struct {
	NextToken ContinuationToken `json:"nextToken"`
}
