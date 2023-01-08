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
	"log"
	"oss-tracing/pkg/api"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	"oss-tracing/pkg/usageReport"
	spanreaderes "oss-tracing/plugin/spanreader/es"
	"time"

	"github.com/go-co-op/gocron"
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

	sr, err := spanreaderes.NewSpanReader(context.Background(), logger, spanreaderes.NewElasticConfig(cfg), spanreaderes.NewElasticMetaConfig(cfg))
	if err != nil {
		logger.Fatal("Failed to create Span Reader for Elasticsearch", zap.Error(err))
	}
	systemId, err := usageReport.GetSystemId(sr, context.Background())
	if err != nil {
		logger.Fatal("Failed to get SystemId", zap.Error(err))
	}
	logger.Info("System ID retrieved", zap.String("systemId", systemId))
	if cfg.AllowUsageReporting {
		usageReporter, err := usageReport.NewUsageReporter(context.Background(), logger, systemId, cfg.UsageReportURL)
		if err != nil {
			logger.Fatal("Failed to create usage reporter", zap.Error(err))
		}
		periodicRunner := gocron.NewScheduler(time.UTC)
		_, err = periodicRunner.Every("15m").Do(usageReporter.ReportSystemUp)
		if err != nil {
			logger.Fatal("Error defining periodical reporting", zap.Error(err))
		}
		periodicRunner.StartAsync()
	}
	api := api.NewAPI(logger, cfg, &sr)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}
