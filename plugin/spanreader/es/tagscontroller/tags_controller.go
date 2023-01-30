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

package tagscontroller

import (
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/plugin/spanreader/es/errors"
	"oss-tracing/plugin/spanreader/es/tagscontroller/statistics"
	"strings"

	spanreaderes "oss-tracing/plugin/spanreader/es/utils"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.uber.org/zap"
	"golang.org/x/exp/slices"
)

// Currently we use both raw and typed since fields mapping typed API has issue with querying the mapping of *
type tagsController struct {
	rawClient *elasticsearch.Client
	client    *elasticsearch.TypedClient
	idx       string
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

func NewTagsController(logger *zap.Logger, rawClient *elasticsearch.Client, client *elasticsearch.TypedClient, idx string) (TagsController, error) {
	return &tagsController{
		rawClient: rawClient,
		client:    client,
		idx:       idx,
	}, nil
}

// Get available tags.
// Use elastic's GetFieldMapping api
func (r *tagsController) GetAvailableTags(
	ctx context.Context,
	request tagsquery.GetAvailableTagsRequest,
) (tagsquery.GetAvailableTagsResponse, error) {
	var err error
	result := tagsquery.GetAvailableTagsResponse{
		Tags: make([]tagsquery.TagInfo, 0),
	}

	result.Tags, err = r.getTagsMappings(ctx, []string{"*"})
	// mappingData["keyword"]

	if err != nil {
		switch err := err.(type) {
		case *errors.ElasticSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return tagsquery.GetAvailableTagsResponse{}, nil
			}
		default:
			return result, fmt.Errorf("could not get available tags: %v", err)
		}
	}

	return result, nil
}

func (r *tagsController) GetTagsValues(
	ctx context.Context,
	request tagsquery.TagValuesRequest,
	tags []string,
) (map[string]*tagsquery.TagValuesResponse, error) {
	tagsMappings, err := r.getTagsMappings(ctx, tags)
	if err != nil {
		switch err := err.(type) {
		case *errors.ElasticSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return nil, nil
			}
		default:
			return nil, fmt.Errorf("could not get values for tags: %v", tags)
		}
	}

	body, err := r.performGetTagsValuesRequest(ctx, request, tagsMappings)
	if err != nil {
		return map[string]*tagsquery.TagValuesResponse{}, err
	}

	return r.parseGetTagsValuesResponseBody(body)
}

func (r *tagsController) GetTagsStatistics(ctx context.Context, req tagsquery.TagStatisticsRequest) (*tagsquery.TagStatisticsResponse, error) {
	return r.performGetTagsStatisticsRequest(ctx, req)
}

func (r *tagsController) performGetTagsStatisticsRequest(
	ctx context.Context,
	request tagsquery.TagStatisticsRequest,
) (*tagsquery.TagStatisticsResponse, error) {
	req, err := buildTagsStatisticsRequest(request)
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %s", err)
	}

	res, err := r.client.API.Search().Request(req).Index(r.idx).Do(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to perform search: %s", err)
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	result := &tagsquery.TagStatisticsResponse{
		Statistics: make(map[tagsquery.TagStatistic]float64),
	}

	if aggregations, ok := body["aggregations"].(map[string]any); ok {
		for _, d := range request.DesiredStatistics {
			r := statistics.TagStatisticToResolver[d]
			if v, exists := r.GetValue(request.Tag, aggregations); exists {
				result.Statistics[d] = v
			}
		}
	}
	return result, nil
}

func buildTagsStatisticsRequest(request tagsquery.TagStatisticsRequest) (*search.Request, error) {
	builder := search.NewRequestBuilder()
	timeframeFilters := spanreaderes.CreateTimeframeFilters(request.Timeframe)
	filters := append(request.SearchFilters, timeframeFilters...)
	_, err := spanreaderes.BuildQuery(builder, filters...)
	if err != nil {
		return nil, err
	}
	builder.Size(0)

	aggs := make(map[string]*types.AggregationContainerBuilder)

	for _, d := range request.DesiredStatistics {
		r := statistics.TagStatisticToResolver[d]
		r.AddAggregationContainerBuilder(request.Tag, aggs)
	}

	return builder.Aggregations(aggs).Build(), nil
}

// Get elasticsearch mappings for specific tags
func (r *tagsController) getTagsMappings(ctx context.Context, tags []string) ([]tagsquery.TagInfo, error) {
	var result []tagsquery.TagInfo
	tagsMap := make(map[string]tagsquery.TagInfo)
	res, err := r.rawClient.Indices.GetFieldMapping(
		tags,
		r.rawClient.Indices.GetFieldMapping.WithContext(ctx),
		r.rawClient.Indices.GetFieldMapping.WithIndex(r.idx),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get field mapping: %v", err)
	}

	defer res.Body.Close()
	if err := SummarizeResponseError(res); err != nil {
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
	// for example, we might have lupa-traces-000001 and lupa-traces-000002 aliased by lupa-traces,
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

func buildAggregations(builder *search.RequestBuilder, tagsMappings []tagsquery.TagInfo) {
	aggs := make(map[string]*types.AggregationContainerBuilder, len(tagsMappings))
	for _, mapping := range tagsMappings {
		aggregationKey := mapping.Name
		aggregationField := aggregationKey
		if mapping.Type == "Str" {
			aggregationField = fmt.Sprintf("%s.keyword", aggregationKey)
		}
		aggs[aggregationKey] = types.NewAggregationContainerBuilder()
		aggs[aggregationKey].Terms(types.NewTermsAggregationBuilder().Field(types.Field(aggregationField)).Size(100))
	}
	builder.Aggregations(aggs)
}

func buildTagsValuesRequest(request tagsquery.TagValuesRequest, tagsMappings []tagsquery.TagInfo) (*search.Request, error) {
	builder := search.NewRequestBuilder()
	timeframeFilters := spanreaderes.CreateTimeframeFilters(request.Timeframe)
	filters := append(request.SearchFilters, timeframeFilters...)
	_, err := spanreaderes.BuildQuery(builder, filters...)
	if err != nil {
		return nil, err
	}
	builder.Size(0)
	buildAggregations(builder, tagsMappings)
	return builder.Build(), nil
}

// Perform search and return the response body
func (r *tagsController) performGetTagsValuesRequest(
	ctx context.Context,
	request tagsquery.TagValuesRequest,
	tagsMappings []tagsquery.TagInfo,
) (map[string]any, error) {
	req, err := buildTagsValuesRequest(request, tagsMappings)
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %s", err)
	}
	res, err := r.client.API.Search().Request(req).Index(r.idx).Do(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to perform search: %s", err)
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}
	return body, err
}

func (r *tagsController) parseGetTagsValuesResponseBody(
	body map[string]any,
) (map[string]*tagsquery.TagValuesResponse, error) {
	// To get an idea of how the response looks like, check the unit test at tags_controller_test.go

	result := map[string]*tagsquery.TagValuesResponse{}

	tagValueInfos := make(map[string]map[any]tagsquery.TagValueInfo)

	if aggregations, ok := body["aggregations"].(map[string]any); ok {
		// the aggregation key is the tag's name because that's how we defined the query.
		// traverse the returned aggregations, bucket by bucket and update the value counts
		for tag, v := range aggregations {
			aggregation := v.(map[string]any)

			if _, found := tagValueInfos[tag]; !found {
				tagValueInfos[tag] = make(map[any]tagsquery.TagValueInfo)
			}

			for _, v := range aggregation["buckets"].([]any) {
				bucket := v.(map[string]any)
				value := bucket["key"]
				count := int(bucket["doc_count"].(float64))

				if info, found := tagValueInfos[tag][value]; !found {
					tagValueInfos[tag][value] = tagsquery.TagValueInfo{
						Value: value,
						Count: count,
					}
				} else {
					info.Count += count
					tagValueInfos[tag][value] = info
				}
			}
		}
	}

	// populate the result
	for tag, valueInfoMap := range tagValueInfos {
		var currentTagValues []tagsquery.TagValueInfo
		for value, info := range valueInfoMap {
			currentTagValues = append(currentTagValues, tagsquery.TagValueInfo{
				Value: value,
				Count: info.Count,
			})
		}
		if currentTagValues != nil {
			result[tag] = &tagsquery.TagValuesResponse{
				Values: currentTagValues,
			}
		}
	}

	return result, nil
}

// Remove keyword tags that are a duplication of an elasticsearch text field
func removeDuplicatedTextTags(tags []tagsquery.TagInfo) []tagsquery.TagInfo {
	tagsNamesToTypes := make(map[string]string, len(tags))
	var tagsNames []string

	var validTags []tagsquery.TagInfo

	for _, tag := range tags {
		tagsNamesToTypes[tag.Name] = tag.Type
	}

	for tagName := range tagsNamesToTypes {
		tagsNames = append(tagsNames, tagName)
	}

	for _, tag := range tags {
		if tag.Type == "keyword" {
			if strings.Contains(tag.Name, ".keyword") {
				strippedName := tag.Name[:len(tag.Name)-len(".keyword")]
				// If there exists a duplication for the same tag, as text and as keyword
				// This happens then the index is using the default elasticsearch mapping.
				if !(slices.Contains(tagsNames, strippedName) && (tagsNamesToTypes[strippedName] == "text")) {
					validTags = append(validTags, tag)
				}
			} else {
				validTags = append(validTags, tag)
			}
		} else {
			validTags = append(validTags, tag)
		}
	}

	return validTags
}
