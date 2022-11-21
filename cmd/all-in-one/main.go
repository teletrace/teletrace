package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	spanreaderes "oss-tracing/plugin/spanreader/es"

	"github.com/epsagon/lupa/lupa-otelcol/pkg/collector"

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
		log.Fatalf("Failed to initialize SpanReader of Elasticsearch plugin %v", err)
	}

	api := api.NewAPI(logger, cfg, &sr)

	collector, err := collector.NewCollector()
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
}

func startAPI(logger *zap.Logger, api *api.API) {
	if err := api.Start(); err != nil {
		logger.Fatal("API stopped with an error", zap.Error(err))
	}
}

func startCollector(logger *zap.Logger, collector *collector.Collector) {
	if err := collector.Start(); err != nil {
		logger.Fatal("Collector stopped with an error", zap.Error(err))
	}
}
