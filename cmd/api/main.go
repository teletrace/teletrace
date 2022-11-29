package main

import (
	"context"
	"fmt"
	"log"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	spanreaderes "oss-tracing/plugin/spanreader/es"
	sqlite "oss-tracing/plugin/spanreader/sqlite"

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

	sr2, err := sqlite.NewSqliteSpanReader(logger, &sqlite.Config{})

	fmt.Println(sr2)

	sr, err := spanreaderes.NewSpanReader(context.Background(), logger, spanreaderes.NewElasticConfig(cfg))
	if err != nil {
		logger.Fatal("Failed to create Span Reader for Elasticsearch", zap.Error(err))
	}

	api := api.NewAPI(logger, cfg, &sr)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}
