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

	s, err := es.NewStorage(ctx, logger, esConfig)

	s.Initialize()

	if err != nil {
		log.Fatalf("Failed to initialize span writer: %+v", err)
	}

	api := api.NewAPI(logger, cfg, s)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}

}
