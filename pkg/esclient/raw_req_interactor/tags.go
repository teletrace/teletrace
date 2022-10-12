package rawreqinteractor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/config"
	esconfig "oss-tracing/pkg/esclient/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

type tagsController struct {
	client *Client
	index string
}

func NewTagsController(client *Client, cfg config.Config) interactor.TagsController {
	return &tagsController {
		client: client,
		index: esconfig.GenIndexName(cfg),
	}
}

func (r *tagsController) prefixTag(tag string) string {
	return fmt.Sprint("span.attributes.", tag)
}

func (r *tagsController) getResponseError(res *esapi.Response) error {
	if !res.IsError() {
		return nil
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return fmt.Errorf("error parsing the response body: %s", err)
	} else {
		status := res.Status()
		errorType := body["error"].(map[string]any)["type"]
		errorReason := body["error"].(map[string]any)["reason"]
		return fmt.Errorf("error response - status=[%s], type=%v, reason: %v",
			status, errorType, errorReason)
	}
}

func (r *tagsController) GetAvailableTags(
	ctx context.Context,
	request interactor.GetAvailableTagsRequest,
) (interactor.GetAvailableTagsResult, error) {
	client := r.client.Client
	result := interactor.GetAvailableTagsResult {
		Tags: make([]interactor.TagInfo, 0),
	}

	res, err := client.Indices.GetFieldMapping(
		[]string{r.prefixTag("*")},
		client.Indices.GetFieldMapping.WithContext(ctx),
		client.Indices.GetFieldMapping.WithIndex(r.index),
	)

	if err != nil {
		return result, fmt.Errorf("failed to get field mapping: %v", err)
	}

	defer res.Body.Close()
	if err := r.getResponseError(res); err != nil {
		return result, err
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return result, fmt.Errorf("failed to decode body: %v", err)
	}

	// { "lupa-index": { "mappings": { ... }}}
	body = body[r.index].(map[string]any)["mappings"].(map[string]any)

	for _, v := range body {
		fieldMapping := v.(map[string]any)

		mappingData := fieldMapping["mapping"].(map[string]any)
		if len(mappingData) > 1 {
			return result, fmt.Errorf(
				"unknown scenario - mapping data contains more than one entry: %v", mappingData)
		}

		for _, valueData := range mappingData {
			result.Tags = append(result.Tags, interactor.TagInfo{
				Name: fieldMapping["full_name"].(string),
				Type: valueData.(map[string]any)["type"].(string),
			})
		}
	}

	return result, nil
}

func (r *tagsController) GetTagsValues(
	ctx context.Context,
	request interactor.GetTagsValuesRequest,
) (interactor.GetTagsValuesResult, error) {

	if request.AutoPrefixTags == nil {
		autoPrefixTags := true
		request.AutoPrefixTags = &autoPrefixTags
	}

	client := r.client.Client
	result := interactor.NewGetTagsValueResult()

	aggs := make(map[string]any, len(request.Tags))
	for _, field := range request.Tags {

		aggregationKey := field
		if *request.AutoPrefixTags {
			field = r.prefixTag(field)
		}

		aggs[aggregationKey] = map[string]any{
			"terms": map[string]any{
				"field": field,
			},
		}
	}

	query := map[string]any{
		"range": map[string]any{
			"@timestamp": map[string]any{
				"gte": request.StartTime,
				"lte": request.EndTime,
			},
		},
	}

	requestBody := map[string]any{
		"size":  0,
		"aggs":  aggs,
		"query": query,
	}

	buffer := new(bytes.Buffer)
	if err := json.NewEncoder(buffer).Encode(requestBody); err != nil {
		return result, fmt.Errorf("failed to encode body; %v: %v", requestBody, err)
	}

	searchOptions := []func(*esapi.SearchRequest) {
		client.Search.WithIndex(r.index),
		client.Search.WithBody(buffer),
	}

	if request.Query != nil {
		searchOptions = append(searchOptions, client.Search.WithQuery(*request.Query))
	}

	res, err := client.Search(searchOptions...)

	if err != nil {
		return result, fmt.Errorf("failed to perform search: %s", err)
	}

	defer res.Body.Close()
	if err := r.getResponseError(res); err != nil {
		return result, err
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return result, fmt.Errorf("failed parsing the response body: %s", err)
	}

	
	aggregations := body["aggregations"].(map[string]any)
	tagValueInfos := make(map[string]map[any]interactor.TagValueInfo)
	
	// the aggregation key is the tag's name becuase that's how we defined the query
	for tag, v := range aggregations {
		aggregation := v.(map[string]any)

		if _, found := tagValueInfos[tag]; !found {
			tagValueInfos[tag] = make(map[any]interactor.TagValueInfo)
		}
		
		for _, v := range aggregation["buckets"].([]any) {
			bucket := v.(map[string]any)
			value := bucket["key"]
			count := int(bucket["doc_count"].(float64))

			if info, found := tagValueInfos[tag][value]; !found {
				tagValueInfos[tag][value] = interactor.TagValueInfo{
					Value: value,
					Count: count,
				}
			} else {
				info.Count += count
				tagValueInfos[tag][value] = info
			}
		}
	}

	// populate the result
	for tag, valueInfoMap := range tagValueInfos {
		result.Tags[tag] = []interactor.TagValueInfo {}
		for value, info := range valueInfoMap {
			result.Tags[tag] = append(result.Tags[tag], interactor.TagValueInfo{
				Value: value,
				Count: info.Count,
			})
		}
	}

	return result, nil
}
