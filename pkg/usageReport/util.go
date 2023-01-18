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
package usageReport

import (
	"context"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/model/metadata/v1"
	"oss-tracing/pkg/spanreader"
	"time"

	"github.com/go-co-op/gocron"
	"go.uber.org/zap"

	"github.com/google/uuid"
)

func GetSystemId(sr spanreader.SpanReader, ctx context.Context) (string, error) {
	queryCtx, cancelFunc := context.WithTimeout(ctx, 10*time.Second)
	defer cancelFunc()
	systemIdRes, err := sr.GetSystemId(queryCtx, metadata.GetSystemIdRequest{})
	if err != nil {
		return "", err
	}
	if systemIdRes == nil {
		systemId := uuid.New().String()
		if _, err := sr.SetSystemId(queryCtx, metadata.SetSystemIdRequest{
			Value: systemId,
		}); err != nil {
			return "", err
		}
		return systemId, nil
	}
	return systemIdRes.Value, nil
}

func InitializePeriodicalUsageReporting(sr spanreader.SpanReader, cfg *config.Config, logger *zap.Logger) (*gocron.Scheduler, error) {
	systemId, err := GetSystemId(sr, context.Background())
	if err != nil {
		logger.Error("Failed to get SystemId", zap.Error(err))
		return nil, err
	}
	logger.Info("System ID retrieved", zap.String("systemId", systemId))
	usageReporter, err := NewUsageReporter(context.Background(), logger, systemId, cfg.UsageReportURL)
	if err != nil {
		logger.Error("Failed to create usage reporter", zap.Error(err))
		return nil, err
	}
	periodicRunner := gocron.NewScheduler(time.UTC)
	_, err = periodicRunner.Every("15m").Do(usageReporter.ReportSystemUp)
	if err != nil {
		logger.Error("Error defining periodical reporting", zap.Error(err))
		return nil, err
	}
	periodicRunner.StartAsync()
	return periodicRunner, nil
}
