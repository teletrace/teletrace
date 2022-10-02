package main

import (
	"log"
	"os"
	"strconv"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"

	"go.uber.org/zap"
)

func main() {
	logger, err := newLogger()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer flushBufferedLogs(logger)

	cfg, err := config.NewConfig(logger)
	if err != nil {
		logger.Fatal("Failed to initialize config", zap.Error(err))
	}

	api := api.NewAPI(logger, cfg)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}

func newLogger() (*zap.Logger, error) {
	debug, err := strconv.ParseBool(os.Getenv(config.DebugEnvName))
	if err != nil {
		debug = config.DebugDefault
	}
	if debug {
		return zap.NewDevelopment()
	}
	return zap.NewProduction()
}

func flushBufferedLogs(logger *zap.Logger) {
	if err := logger.Sync(); err != nil {
		log.Printf("Error flushing buffered logs: %v", err)
	}
}
