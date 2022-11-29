package main

import (
	"context"
	"log"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	spanreaderes "oss-tracing/plugin/spanreader/es"

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

	sr, err := spanreaderes.NewSpanReader(context.Background(), logger, spanreaderes.NewElasticConfig(cfg))
	if err != nil {
		logger.Fatal("Failed to create Span Reader for Elasticsearch", zap.Error(err))
	}

	api := api.NewAPI(logger, cfg, &sr)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}
