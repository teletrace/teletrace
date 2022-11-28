package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"

	"go.uber.org/zap"
)

type sqliteSpanReader struct {
	db *sql.DB
}

func (sr *sqliteSpanReader) Initialize() error {
	db, err := connectToSqliteDb()
	if err != nil {
		fmt.Println(err)
		return err
	}
	sr.db = db
	err = turnOnForeignKeys(db)
	if err != nil {
		fmt.Println(err)
		return err
	}
	err = createTables(db)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func (sr *sqliteSpanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return nil, nil
}

func (sr *sqliteSpanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return nil, nil
}

func (sr *sqliteSpanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader(logger *zap.Logger) (*sqliteSpanReader, error) {
	sr := &sqliteSpanReader{}
	err := sr.Initialize()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return &sqliteSpanReader{
		db: sr.db,
	}, nil
}
