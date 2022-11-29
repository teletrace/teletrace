package searchcontroller

import (
	"context"
	"database/sql"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"sync"
)

type sqliteSearchController struct {
	mx sync.Mutex
	db *sql.DB
}

func NewSqliteSearchController(db *sql.DB) (*sqliteSearchController, error) {
	return &sqliteSearchController{
		db: db,
	}, nil
}

func (s *sqliteSearchController) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return nil, nil
}

func buildSearchRequest(r spansquery.SearchRequest) (sql.Result, error) {
	return nil, nil
}

func buildQuery(fs ...model.SearchFilter) (string, error) {
	return "", nil
}
