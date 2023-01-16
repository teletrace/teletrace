/**
* Copyright 2020, OpenTelemetry Authors
* Modifications copyright (C) 2022 Cisco Systems, Inc.
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

package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/epsagon/lupa/pkg/modeltranslator"
)

type elasticsearchTracesExporter struct {
	logger     *zap.Logger
	cfg        *Config
	client     *elasticsearch.Client
	maxRetries int
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*elasticsearchTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	esClient, err := newClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %+v", err)
	}

	maxRetries := 1
	if cfg.Retry.Enabled {
		maxRetries = cfg.Retry.MaxRetries
	}

	return &elasticsearchTracesExporter{
		logger:     logger,
		cfg:        cfg,
		client:     esClient,
		maxRetries: maxRetries,
	}, nil
}

func (e *elasticsearchTracesExporter) Shutdown(ctx context.Context) error {
	return nil
}

func (e *elasticsearchTracesExporter) pushTracesData(ctx context.Context, td ptrace.Traces) error {
	internalSpans := modeltranslator.TranslateOTLPToInternalModel(td)

	return writeSpans(ctx, e.logger, e.client, e.cfg.Index, internalSpans...)
}
