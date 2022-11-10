package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
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

func (reader *spanReader) GetAvailableTags(ctx context.Context, r model.GetAvailableTagsRequest) (*model.GetAvailableTagsResult, error) {
	res, err := reader.tagsController.GetAvailableTags(ctx, r)

	if err != nil {
		return nil, fmt.Errorf("GetAvailableTags failed with error: %+v", err)
	}

	return &res, nil
}
