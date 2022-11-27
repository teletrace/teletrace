package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/repository"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

import _ "github.com/mattn/go-sqlite3"

type sqliteTracesExporter struct {
	writer *writer
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*sqliteTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", "embedded_spans_db")
	if err != nil {
		return nil, fmt.Errorf("could not create sqlite exporter: %+v", err)
	}
	repository.InitDatabase(db)

	return &sqliteTracesExporter{
		writer: &writer{
			logger: logger,
			db:     db,
		},
	}, nil

}

func (e *sqliteTracesExporter) Shutdown(ctx context.Context) error {
	if err := e.writer.db.Close(); err != nil {
		return fmt.Errorf("could not shut down sqlite exporter: %+v", err)
	}
	return nil
}

func (e *sqliteTracesExporter) pushTracesData(ctx context.Context, traces ptrace.Traces) error {
	return e.writer.writeTraces(traces)
}
