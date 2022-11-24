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

	db *sql.DB
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*sqliteTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", "embedded_spans_db")
	if err != nil {
		return nil, fmt.Errorf("could not create sqlite exporter: %+v", err)
	}
	InitDatabase(db)

	return &sqliteTracesExporter{
		logger: logger,
		db:     db,
	}, nil

}

func (e *sqliteTracesExporter) Shutdown(ctx context.Context) error {
	if err := e.db.Close(); err != nil {
		return fmt.Errorf("could not shut down sqlite exporter: %+v", err)
	}
	return nil
}

func (e *sqliteTracesExporter) pushTracesData(ctx context.Context, td ptrace.Traces) error {
	return writeSpan(ctx, e.logger, td, e.db)
}
