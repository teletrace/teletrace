package tagscontroller

import (
	"context"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type TagsController interface {
	// Get all available tags
	GetAvailableTags(ctx context.Context, request tagsquery.GetAvailableTagsRequest) (tagsquery.GetAvailableTagsResponse, error)

	// Get the values and appearance count of all tags as specified by request.Tags
	GetTagsValues(ctx context.Context, request tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error)
}
