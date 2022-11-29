package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"oss-tracing/plugin/spanreader/sqlite/searchcontroller"
	"sync"

	"go.uber.org/zap"
)

type sqliteSpanReader struct {
	cfg              SqliteConfig
	logger           *zap.Logger
	ctx              context.Context
	mx               sync.Mutex
	db               *sql.DB
	searchController searchcontroller.SqliteSearchController
}

func (sr *sqliteSpanReader) Initialize() error {
	sr.mx.Lock()
	db, err := connectToSqliteDb()
	if err != nil {
		fmt.Println(err)
		return err
	}
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
	sr.db = db
	defer sr.db.Close()
	sr.mx.Unlock()
	return nil
}

func (sr *sqliteSpanReader) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	res, err := sr.searchController.Search(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("Could not index document: %+v", err)
	}
	return res, nil
}

func (sr *sqliteSpanReader) GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error) {
	return nil, nil
}

func (sr *sqliteSpanReader) GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error) {
	return nil, nil
}

func NewSqliteSpanReader(logger *zap.Logger, cfg *Config) (*sqliteSpanReader, error) {
	fmt.Println(cfg)
	sr := &sqliteSpanReader{}
	err := sr.Initialize()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	dbName := fmt.Sprintf("%sembedded_spans", cfg.DBSettings.Path)
	fmt.Println(dbName)
	searchController, err := searchcontroller.NewSqliteSearchController(sr.db)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return &sqliteSpanReader{
		mx:               sync.Mutex{},
		db:               sr.db,
		searchController: searchController,
	}, nil
}
