package main

import (
	"context"
	"log"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"
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

	storage, err := es.NewStorage(context.Background(), logger, interactor.NewElasticConfig(cfg))
	if err != nil {
		logger.Fatal("Failed to initialize ES storage", zap.Error(err))
	}

	sr, err := storage.CreateSpanReader()
	if err != nil {
		logger.Fatal("Failed to create Span Reader from Storage", zap.Error(err))
	}

	api := api.NewAPI(logger, cfg, &sr)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}

	ctx := context.Background()

	esConfig := interactor.ElasticConfig{
		Endpoint:     cfg.ESEndpoints,
		Username:     cfg.ESUsername,
		Password:     cfg.ESPassword,
		ApiKey:       cfg.ESAPIKey,
		ServiceToken: cfg.ESServiceToken,
		ForceCreate:  cfg.ESForceCreateConfig,
		Index:        cfg.ESIndex,
	}

	_, err = es.NewStorage(ctx, logger, esConfig)

	if err != nil {
		log.Fatalf("Failed to initialize span writer: %+v", err)
	}
}
