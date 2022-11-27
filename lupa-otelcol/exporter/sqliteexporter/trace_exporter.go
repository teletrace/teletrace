package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/repository"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter/tracewriter"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

import _ "github.com/mattn/go-sqlite3"

const driverName = "sqlite3"
const dbName = "embedded_spans_db"

type sqliteTracesExporter struct {
	traceWriter tracewriter.TraceWriter
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*sqliteTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	db, err := sql.Open(driverName, dbName)
	if err != nil {
		return nil, fmt.Errorf("could not create sqlite exporter: %+v", err)
	}
	repository.InitDatabase(db)

	return &sqliteTracesExporter{
		tracewriter.NewTraceWriter(logger, db),
	}, nil

}

func (exporter *sqliteTracesExporter) Shutdown(ctx context.Context) error {
	if err := exporter.traceWriter.CloseDB(); err != nil {
		return fmt.Errorf("could not shut down sqlite exporter: %+v", err)
	}
	return nil
}

func (exporter *sqliteTracesExporter) pushTracesData(ctx context.Context, traces ptrace.Traces) error {
	return exporter.traceWriter.WriteTraces(traces)
}
