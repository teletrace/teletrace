package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

import _ "github.com/mattn/go-sqlite3"

type sqliteTracesExporter struct {
	logger *zap.Logger
	db     *sql.DB
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*sqliteTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	dbName := cfg.Path

	if err := migrateSchema(dbName); err != nil {
		return nil, fmt.Errorf("could not migrate DB: %+v", err)
	}

	db, err := sql.Open("sqlite3", fmt.Sprintf("%s", dbName))
	if err != nil {
		return nil, fmt.Errorf("could not create sqlite exporter: %+v", err)
	}

	return &sqliteTracesExporter{
		logger: logger,
		db:     db,
	}, nil

}

func (exporter *sqliteTracesExporter) Shutdown(ctx context.Context) error {
	if err := exporter.db.Close(); err != nil {
		return fmt.Errorf("could not shut down sqlite exporter: %+v", err)
	}
	return nil
}

func (exporter *sqliteTracesExporter) pushTracesData(ctx context.Context, traces ptrace.Traces) error {
	return exporter.writeTraces(traces)
}
