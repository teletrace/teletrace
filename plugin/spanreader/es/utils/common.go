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

package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/plugin/spanreader/es/errors"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

var convertedTimestampKeys = []model.FilterKey{"span.startTimeUnixNano", "span.endTimeUnixNano", "externalFields.durationNano"}

func CreateTimeframeFilters(tf *model.Timeframe) []model.SearchFilter {
	if tf == nil {
		return []model.SearchFilter{}
	}
	return []model.SearchFilter{
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.startTimeUnixNano",
				Operator: spansquery.OPERATOR_GTE,
				Value:    tf.StartTime,
			},
		},
		{
			KeyValueFilter: &model.KeyValueFilter{
				Key:      "span.endTimeUnixNano",
				Operator: spansquery.OPERATOR_LTE,
				Value:    tf.EndTime,
			},
		},
	}
}

func BuildQuery(b *search.RequestBuilder, fs ...model.SearchFilter) (*search.RequestBuilder, error) {
	var err error
	query := types.NewQueryContainerBuilder()

	var kvFilters []model.KeyValueFilter

	for _, f := range fs {
		if f.KeyValueFilter != nil {
			kvFilters = append(kvFilters, *f.KeyValueFilter)
		}
	}
	query, err = BuildFilters(query, kvFilters, WithMilliSecTimestampAsNanoSec())

	if err != nil {
		return nil, fmt.Errorf("Could not build filters: %+v", err)
	}

	return b.Query(query), nil
}

func DecodeResponse(res *http.Response) (map[string]any, error) {
	// check errors
	var err error
	var body map[string]any
	decoder := json.NewDecoder(res.Body)
	decoder.UseNumber()
	if err = decoder.Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	if res.StatusCode >= 400 {
		esError, err := errors.ESErrorFromHttpResponse(res.Status, body)
		if err != nil {
			return nil, err
		}
		return nil, esError
	}
	return body, nil
}

func IsConvertedTimestamp(key model.FilterKey) bool {
	for _, ctk := range convertedTimestampKeys {
		if ctk == key {
			return true
		}
	}
	return false
}

func MilliToNano(millis uint64) uint64 {
	return millis * 1e6
}

func NanoToMilli(nanos uint64) uint64 {
	return nanos / 1e6
}
