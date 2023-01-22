/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package tagsquery

import (
	"fmt"
	"oss-tracing/pkg/model"
)

type TagValuesRequest struct {
	Timeframe     *model.Timeframe     `json:"timeframe"`
	SearchFilters []model.SearchFilter `json:"filters"`
}

func (r *TagValuesRequest) Validate() error {
	if r.Timeframe != nil && r.Timeframe.EndTime < r.Timeframe.StartTime && r.Timeframe.EndTime != 0 {
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

type TagStatisticsRequest struct {
	Timeframe *model.Timeframe `json:"timeframe"`
	Tag       string           `json:"tag"`
	Edge      bool             `json:"edge"`
	Avg       bool             `json:"avg"`
	P99       bool             `json:"p99"`
}

func (r *TagStatisticsRequest) Validate() error {
	if r.Timeframe != nil && r.Timeframe.EndTime < r.Timeframe.StartTime && r.Timeframe.EndTime != 0 {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}

type EdgeValues struct {
	Min float64 `json:"min"`
	Max float64 `json:"max"`
}

type TagStatisticsResponse struct {
	Edge *EdgeValues `json:"edge"`
	Avg  *float64    `json:"avg"`
	P99  *float64    `json:"p99"`
}

type GetAvailableTagsRequest struct{}

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
