package sqlite

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type SqliteSpanReader struct {
	cfg    SqliteConfig
	logger *zap.Logger
	ctx    context.Context
	client sqliteClient
}

func (sr *SqliteSpanReader) Initialize() error {
	return nil
}

func (sr *SqliteSpanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return nil, nil
}

func (sr *SqliteSpanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return nil, nil
}

func (sr *SqliteSpanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader(ctx context.Context, logger *zap.Logger, cfg SqliteConfig) (*SqliteSpanReader, error) {
	errMsg := "cannot create a new span reader for sqlite: %w"

	client, err := newSqliteClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return &SqliteSpanReader{
		cfg:    cfg,
		logger: logger,
		ctx:    ctx,
		client: *client,
	}, nil
}
