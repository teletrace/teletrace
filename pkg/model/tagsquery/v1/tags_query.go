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

	"github.com/teletrace/teletrace/pkg/model"
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

type TagStatistic string

const (
	MIN TagStatistic = "min"
	MAX TagStatistic = "max"
	AVG TagStatistic = "avg"
	P99 TagStatistic = "p99"
)

type TagStatisticsRequest struct {
	Timeframe         *model.Timeframe     `json:"timeframe"`
	SearchFilters     []model.SearchFilter `json:"filters"`
	DesiredStatistics []TagStatistic       `json:"desiredStatistics"`
}

func (r *TagStatisticsRequest) Validate() error {
	if r.Timeframe != nil && r.Timeframe.EndTime < r.Timeframe.StartTime && r.Timeframe.EndTime != 0 {
		return fmt.Errorf("endTime cannot be smaller than startTime")
	}

	return nil
}

type TagStatisticsResponse struct {
	Statistics map[TagStatistic]float64 `json:"statistics"`
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
