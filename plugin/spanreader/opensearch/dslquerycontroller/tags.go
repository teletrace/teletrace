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

package dslquerycontroller

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/errors"
	"go.opentelemetry.io/collector/pdata/pcommon"
)

func (dc *dslQueryController) GetAvailableTags(ctx context.Context, req tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	var err error
	result := tagsquery.GetAvailableTagsResponse{
		Tags: make([]tagsquery.TagInfo, 0),
	}

	result.Tags, err = dc.getTagsMappings(ctx, []string{"*"})
	// mappingData["keyword"]

	if err != nil {
		switch err := err.(type) {
		case *errors.OpenSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return &tagsquery.GetAvailableTagsResponse{}, nil
			}
		default:
			return &result, fmt.Errorf("could not get available tags: %v", err)
		}
	}

	return &result, nil
}

func (dc *dslQueryController) GetTagsValues(ctx context.Context, req tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	tagsMappings, err := dc.getTagsMappings(ctx, tags)
	if err != nil {
		switch err := err.(type) {
		case *errors.OpenSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return nil, nil
			}
		default:
			return nil, fmt.Errorf("could not get values for tags: %v", tags)
		}
	}

	body, err := dc.performGetTagsValuesRequest(ctx, req, tagsMappings)
	if err != nil {
		return map[string]*tagsquery.TagValuesResponse{}, err
	}

	return parseGetTagsValuesResponseBody(body)
}

func (dc *dslQueryController) GetTagsStatistics(ctx context.Context, req tagsquery.TagStatisticsRequest, tag string) (*tagsquery.TagStatisticsResponse, error) {
	return dc.performGetTagsStatisticsRequest(ctx, req, tag, WithMilliSecTimestampAsNanoSecTagStatistics())
}

var tagsValueTypeMap = map[string]pcommon.ValueType{
	"text":    pcommon.ValueTypeStr,
	"keyword": pcommon.ValueTypeStr,
	"long":    pcommon.ValueTypeInt,
	"integer": pcommon.ValueTypeInt,
	"byte":    pcommon.ValueTypeInt,
	"short":   pcommon.ValueTypeInt,
	"float":   pcommon.ValueTypeDouble,
	"double":  pcommon.ValueTypeDouble,
	"boolean": pcommon.ValueTypeBool,
}

func (dc *dslQueryController) performGetTagsStatisticsRequest(
	ctx context.Context,
	req tagsquery.TagStatisticsRequest,
	tag string,
	opts ...TagStatisticParseOption,
) (*tagsquery.TagStatisticsResponse, error) {
	errMsg := "failed to build query: %+v"

	qc, err := BuildFiltersWithTimeFrame(req.SearchFilters, req.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	aggs, err := buildTagsStatisticsAggs(req.DesiredStatistics, tag)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	body, err := buildSearchBody(qc, aggs)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	res, err := dc.client.Search(
		dc.client.Search.WithIndex(dc.idx),
		dc.client.Search.WithContext(ctx),
		dc.client.Search.WithSize(0),
		dc.client.Search.WithBody(body),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to perform search: %s", err)
	}

	var resBody map[string]any
	if err := json.NewDecoder(res.Body).Decode(&resBody); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	return parseTagStatisticsResponseBody(resBody, req, tag, opts)
}

// Get elasticsearch mappings for specific tags
func (dc *dslQueryController) getTagsMappings(ctx context.Context, tags []string) ([]tagsquery.TagInfo, error) {
	var result []tagsquery.TagInfo
	tagsMap := make(map[string]tagsquery.TagInfo)
	res, err := dc.client.Indices.GetFieldMapping(
		tags,
		dc.client.Indices.GetFieldMapping.WithContext(ctx),
		dc.client.Indices.GetFieldMapping.WithIndex(dc.idx),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get field mapping: %v", err)
	}

	defer res.Body.Close()
	if err := errors.SummarizeResponseError(res); err != nil {
		return nil, err
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed to decode body: %v", err)
	}

	if res.StatusCode < 200 && res.StatusCode >= 300 {
		return nil, fmt.Errorf("Could not get tags, got status: %+v", res.StatusCode)
	}

	// in case multiple indices are managed by a single alias (in rollover for example)
	// we need to traverse all indices, not only r.idx.
	// for example, we might have teletrace-traces-000001 and teletrace-traces-000002 aliased by teletrace-traces,
	// so we need to traverse body[*] to acquire the information per index.

	// _ is the index name
	// v is the response correlated for this index
	for _, v := range body {
		indexMappings := v.(map[string]any)["mappings"].(map[string]any)

		for _, v := range indexMappings {
			fieldMapping := v.(map[string]any)

			mappingData := fieldMapping["mapping"].(map[string]any)
			if len(mappingData) > 1 {
				return nil, fmt.Errorf(
					"unknown scenario - mapping data contains more than one entry: %v", mappingData)
			}

			for _, valueData := range mappingData {
				fieldName := fieldMapping["full_name"].(string)
				if _, ok := tagsMap[fieldName]; !ok {
					tagsMap[fieldName] = tagsquery.TagInfo{
						Name: fieldName,
						Type: tagsValueTypeMap[valueData.(map[string]any)["type"].(string)].String(),
					}
				}
			}
		}
	}

	for _, val := range tagsMap {
		result = append(result, val)
	}
	result = removeDuplicatedTextTags(result)

	return result, nil
}

// Perform search and return the response body
func (dc *dslQueryController) performGetTagsValuesRequest(
	ctx context.Context,
	req tagsquery.TagValuesRequest,
	tagsMappings []tagsquery.TagInfo,
) (map[string]any, error) {
	errMsg := "failed to perform search: %s"

	qc, err := BuildFiltersWithTimeFrame(req.SearchFilters, req.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	aggs, err := buildTagsValuesAggs(tagsMappings)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	body, err := buildSearchBody(qc, aggs)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	res, err := dc.client.Search(
		dc.client.Search.WithIndex(dc.idx),
		dc.client.Search.WithContext(ctx),
		dc.client.Search.WithSize(0),
		dc.client.Search.WithBody(body),
	)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	var resBody map[string]any
	if err := json.NewDecoder(res.Body).Decode(&resBody); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}
	return resBody, err
}
