package sqliteexporter

import (
	"context"
	"database/sql"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

func writeSpan(ctx context.Context, logger *zap.Logger, td ptrace.Traces, db *sql.DB) error {
	return nil
}
