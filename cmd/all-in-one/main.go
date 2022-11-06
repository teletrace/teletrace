package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"oss-tracing/cmd/collector/app"
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

	api := api.NewAPI(logger, cfg)

	storage, err := es.NewStorage(context.Background(), logger, interactor.NewElasticConfig(cfg))
	if err != nil {
		logger.Fatal("Failed to initialize ES storage", zap.Error(err))
	}

	collector, err := app.NewCollector(cfg, logger, storage)
	if err != nil {
		logger.Fatal("Failed to initialize collector", zap.Error(err))
	}

	signalsChan := make(chan os.Signal, 1)
	signal.Notify(signalsChan, os.Interrupt, syscall.SIGTERM)

	go startAPI(logger, api)
	go startCollector(logger, collector)

	for sig := range signalsChan {
		logger.Warn("Received system signal", zap.String("signal", sig.String()))
		break
	}

	collector.Stop()
}

func startAPI(logger *zap.Logger, api *api.API) {
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}

func startCollector(logger *zap.Logger, collector *app.Collector) {
	if err := collector.Start(); err != nil {
		logger.Fatal("Failed to start collector", zap.Error(err))
	}
}
