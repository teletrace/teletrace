package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type spanReader struct {
	documentController interactor.DocumentController
	tagsController     interactor.TagsController
}

func (reader *spanReader) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	res, err := reader.documentController.Search(ctx, r)

	if err != nil {
		return nil, fmt.Errorf("Could not index document: %+v", err)
	}

	return res, nil
}

func (reader *spanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	res, err := reader.tagsController.GetAvailableTags(ctx, r)

	if err != nil {
		return nil, fmt.Errorf("GetAvailableTags failed with error: %+v", err)
	}

	return &res, nil
}

func (reader *spanReader) GetTagsValues(
	ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	res, err := reader.tagsController.GetTagsValues(ctx, r, tags)

	if err != nil {
		return nil, fmt.Errorf("GetTagsValues failed with error: %+v", err)
	}

	return res, nil
}
