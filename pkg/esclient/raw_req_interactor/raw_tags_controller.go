package rawreqinteractor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/config"
	esconfig "oss-tracing/pkg/esclient/config"
	"oss-tracing/pkg/esclient/errors"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

type rawTagsController struct {
	client *Client
	index  string
}

func NewTagsController(client *Client, cfg config.Config) interactor.TagsController {
	return &rawTagsController{
		client: client,
		index:  esconfig.GenIndexName(cfg),
	}
}

func (r *rawTagsController) prefixTag(tag string) string {
	return fmt.Sprint("span.attributes.", tag)
}

// Get available tags.
//
// Use elastic's GetFieldMapping api
func (r *rawTagsController) GetAvailableTags(
	ctx context.Context,
	request interactor.GetAvailableTagsRequest,
) (interactor.GetAvailableTagsResult, error) {
	client := r.client.Client
	result := interactor.GetAvailableTagsResult{
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
	if err := errors.SummarizeResponseError(res); err != nil {
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

func (r *rawTagsController) GetTagsValues(
	ctx context.Context,
	request interactor.GetTagsValuesRequest,
) (interactor.GetTagsValuesResult, error) {

	body, err := r.performGetTagsValuesRequest(ctx, request)

	if err != nil {
		return interactor.NewGetTagsValueResult(), err
	}

	return r.parseGetTagsValuesResponseBody(body)
}

// Perform search and return the response' body
func (r *rawTagsController) performGetTagsValuesRequest(
	ctx context.Context,
	request interactor.GetTagsValuesRequest,
) (map[string]any, error) {

	if request.AutoPrefixTags == nil {
		autoPrefixTags := true
		request.AutoPrefixTags = &autoPrefixTags
	}

	client := r.client.Client

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
		return nil, fmt.Errorf("failed to encode body; %v: %v", requestBody, err)
	}

	searchOptions := []func(*esapi.SearchRequest){
		client.Search.WithIndex(r.index),
		client.Search.WithBody(buffer),
	}

	if request.Query != nil {
		searchOptions = append(searchOptions, client.Search.WithQuery(*request.Query))
	}

	res, err := client.Search(searchOptions...)

	if err != nil {
		return nil, fmt.Errorf("failed to perform search: %s", err)
	}

	defer res.Body.Close()
	if err := errors.SummarizeResponseError(res); err != nil {
		return nil, err
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("failed parsing the response body: %s", err)
	}

	return body, err
}

func (r *rawTagsController) parseGetTagsValuesResponseBody(
	body map[string]any,
) (interactor.GetTagsValuesResult, error) {

	// To get an idea of how the response looks like, check the unit test at raw_tags_controller_test.go

	result := interactor.NewGetTagsValueResult()
	aggregations := body["aggregations"].(map[string]any)
	tagValueInfos := make(map[string]map[any]interactor.TagValueInfo)

	// the aggregation key is the tag's name because that's how we defined the query.
	// traverse the returned aggregations, bucket by bucket and update the value counts
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
		result.Tags[tag] = []interactor.TagValueInfo{}
		for value, info := range valueInfoMap {
			result.Tags[tag] = append(result.Tags[tag], interactor.TagValueInfo{
				Value: value,
				Count: info.Count,
			})
		}
	}

	return result, nil
}
