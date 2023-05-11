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
	"encoding/json"
	"fmt"
	"strings"

	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"golang.org/x/exp/slices"

	"github.com/mitchellh/mapstructure"
	internalspan "github.com/teletrace/teletrace/model/internalspan/v1"
)

type SpanParseOption func(*internalspan.InternalSpan)

func parseSpansResponse(body map[string]any, opts ...SpanParseOption) (*spansquery.SearchResponse, error) {
	var err error

	hits := body["hits"].(map[string]any)["hits"].([]any)

	spans := []*internalspan.InternalSpan{}
	for _, h := range hits {
		hit := h.(map[string]any)["_source"].(map[string]any)
		var s internalspan.InternalSpan
		err = mapstructure.Decode(hit, &s)
		for _, opt := range opts {
			opt(&s)
		}
		if err != nil {
			return nil, fmt.Errorf("Could not decode response hit from elasticsearch: %+v", err)
		}
		spans = append(spans, &s)
	}

	var metadata *spansquery.Metadata
	if len(hits) > 0 {
		metadata = &spansquery.Metadata{}
		if err := extractNextToken(hits, metadata); err != nil {
			return nil, err
		}
	}

	return &spansquery.SearchResponse{
		Spans:    spans,
		Metadata: metadata,
	}, nil
}

func extractNextToken(hits []any, metadata *spansquery.Metadata) error {
	if lastHitSortData := hits[len(hits)-1].(map[string]any)["sort"]; lastHitSortData != nil {
		lastHitSortData := lastHitSortData.([]any)
		if len(lastHitSortData) == 0 {
			return nil
		}
		tokenFields := make([]string, len(lastHitSortData))
		for i, key := range lastHitSortData {
			tokenFields[i] = fmt.Sprintf("%v", key)
		}
		jsonToken, err := json.Marshal(tokenFields)
		if err != nil {
			return err
		}
		metadata.NextToken = spansquery.ContinuationToken(jsonToken)

	}
	return nil
}

func withMiliSecTimestampAsNanoSec() SpanParseOption {
	return func(s *internalspan.InternalSpan) {
		s.Span.StartTimeUnixNano = s.Span.StartTimeUnixNano * 1000 * 1000
		s.Span.EndTimeUnixNano = s.Span.EndTimeUnixNano * 1000 * 1000

		for _, e := range s.Span.Events {
			e.TimeUnixNano = e.TimeUnixNano * 1000 * 1000
		}

		s.ExternalFields.DurationNano = s.ExternalFields.DurationNano * 1000 * 1000
	}
}

func parseGetTagsValuesResponseBody(
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

func parseTagStatisticsResponseBody(
	body map[string]any, request tagsquery.TagStatisticsRequest, tag string, opts []TagStatisticParseOption,
) (*tagsquery.TagStatisticsResponse, error) {
	result := &tagsquery.TagStatisticsResponse{
		Statistics: make(map[tagsquery.TagStatistic]float64),
	}

	if aggregations, ok := body["aggregations"].(map[string]any); ok {
		for _, ds := range request.DesiredStatistics {
			h := TagStatisticToHandler[ds]
			if v, exists := h.GetValue(aggregations); exists {
				result.Statistics[ds] = v
			}
		}
	}

	for k := range result.Statistics {
		for _, opt := range opts {
			opt(tag, result.Statistics, k)
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
		if tag.Type == pcommon.ValueTypeStr.String() {
			if strings.HasSuffix(tag.Name, ".keyword") {
				strippedName := tag.Name[:len(tag.Name)-len(".keyword")]
				// If there exists a duplication for the same tag, as text and as keyword
				// This happens then the index is using the default elasticsearch mapping.
				if !(slices.Contains(tagsNames, strippedName) && (tagsNamesToTypes[strippedName] == pcommon.ValueTypeStr.String())) {
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

func parseSystemIdResponse(body map[string]any) string {
	return body["_source"].(map[string]any)["value"].(string)
}
