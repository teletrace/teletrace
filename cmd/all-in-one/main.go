/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	"oss-tracing/pkg/spanreader"
	"syscall"

	spanreaderes "oss-tracing/plugin/spanreader/es"
	sqlite "oss-tracing/plugin/spanreader/sqlite"

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
	sr, err := initializeSpanReader(cfg, logger)
	if err != nil {
		if cfg.SpansStoragePlugin != "" {
			log.Fatalf("Failed to initialize SpanReader of %s plugin %v", cfg.SpansStoragePlugin, err)
		} else {
			log.Fatalf("Failed to initialize SpanReader plugin %v", err)
		}
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

func initializeSpanReader(cfg config.Config, logger *zap.Logger) (spanreader.SpanReader, error) {
	switch cfg.SpansStoragePlugin {
	case "sqlite":
		return sqlite.NewSqliteSpanReader(context.Background(), logger, sqlite.NewSqliteConfig(cfg))
	case "elasticsearch":
		return spanreaderes.NewSpanReader(context.Background(), logger, spanreaderes.NewElasticConfig(cfg))
	default:
		return nil, fmt.Errorf("Invalid spans storage plugin %s", cfg.SpansStoragePlugin)
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
