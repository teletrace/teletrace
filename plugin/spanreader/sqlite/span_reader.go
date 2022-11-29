package sqlite

import (
	"context"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type sqliteSpanReader struct {
	cfg    *SqliteConfig
	client *sqliteClient
}

func (sr *sqliteSpanReader) Initialize() error {
	return nil
}

func (sr *sqliteSpanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	err := sr.client.db.Ping()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return nil, nil
}

func (sr *sqliteSpanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return nil, nil
}

func (sr *sqliteSpanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader() (*sqliteSpanReader, error) {
	cfg := NewSqliteConfig("test.db")
	client, err := newSqliteClient(cfg)
	if err != nil {
		return nil, err
	}

	return &sqliteSpanReader{
		cfg:    cfg,
		client: client,
	}, nil
}
