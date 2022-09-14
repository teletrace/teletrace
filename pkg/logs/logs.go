package logs

import (
	"log"
	"oss-tracing/pkg/config"

	"go.uber.org/zap"
)

// NewLogger returns a new zap logger with custom config based on the debug mode.
func NewLogger(cfg config.Config) (*zap.Logger, error) {
	if cfg.Debug {
		return zap.NewDevelopment()
	}
	return zap.NewProduction()
}

// FlushBufferedLogs attempts to flush any buffered log entries of a zap logger.
// It is recommended to call it before the process exists.
func FlushBufferedLogs(logger *zap.Logger) {
	if err := logger.Sync(); err != nil {
		log.Printf("Error flushing buffered logs: %v", err)
	}
}
