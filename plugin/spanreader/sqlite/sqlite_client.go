package sqlite

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"

	"go.uber.org/zap"
)

type sqliteClient struct {
	db *sql.DB
}

func newSqliteClient(logger *zap.Logger, cfg SqliteConfig) (*sqliteClient, error) {
	sqliteConfig := SqliteConfig{
		Path: cfg.Path,
	}
	db, err := sql.Open("sqlite3", sqliteConfig.Path)
	if err != nil {
		logger.Error("Could not connect to sqlite database: %+v", zap.Error(err))
		return nil, err
	}
	return &sqliteClient{
		db: db,
	}, nil
}
