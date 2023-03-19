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

	"github.com/teletrace/teletrace/pkg/api"
	"github.com/teletrace/teletrace/pkg/config"
	"github.com/teletrace/teletrace/pkg/logs"
	"github.com/teletrace/teletrace/pkg/usageReport"
	spanreaderes "github.com/teletrace/teletrace/plugin/spanreader/es"

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
	if cfg.AllowUsageReporting {
		_, err = usageReport.InitializePeriodicalUsageReporting(sr, &cfg, logger)
		if err != nil {
			logger.Error("Failed to start usage reporting task", zap.Error(err))
		}
	}
	api := api.NewAPI(logger, cfg, &sr)
	if err := api.Start(); err != nil {
		logger.Fatal("API server crashed", zap.Error(err))
	}
}
