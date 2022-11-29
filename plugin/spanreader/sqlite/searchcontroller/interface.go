package searchcontroller

import (
	"context"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type SqliteSearchController interface {
	// Search spans in database
	Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error)
}
