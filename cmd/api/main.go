package main

import (
	"context"
	"log"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	"oss-tracing/plugin/spanstorage/es"

	"go.uber.org/zap"
)

func main() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Failed to initialize config: %v", err)
	}

	logger, err := logs.NewLogger(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logs.FlushBufferedLogs(logger)

	api := api.NewAPI(logger, cfg)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}

	ctx := context.Background()

	_, err = es.NewSpanWriter(ctx, logger, cfg)
}
