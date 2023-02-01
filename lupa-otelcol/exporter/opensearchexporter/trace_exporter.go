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

package opensearchexporter

import (
	"context"
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/internal/modeltranslator"
	"github.com/opensearch-project/opensearch-go"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/multierr"
	"go.uber.org/zap"
)

type opensearchTracesExporter struct {
	logger     *zap.Logger
	cfg        *Config
	client     *opensearch.Client
	maxRetries int
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*opensearchTracesExporter, error) {
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

	return &opensearchTracesExporter{
		logger:     logger,
		cfg:        cfg,
		client:     esClient,
		maxRetries: maxRetries,
	}, nil
}

func (e *opensearchTracesExporter) Shutdown(ctx context.Context) error {
	return nil
}

func (e *opensearchTracesExporter) pushTracesData(ctx context.Context, td ptrace.Traces) error {
	internalSpans := modeltranslator.TranslateOTLPToInternalSpans(td)

	indexer, err := newBulkIndexer(e.logger, e.client, e.cfg)
	if err != nil {
		return fmt.Errorf("failed to create a new bulk indexer: %v", err)
	}

	defer indexer.Close(ctx)

	errs := make([]error, 0, td.SpanCount())
	for span := range internalSpans {
		if err := writeSpan(ctx, e.logger, e.cfg.Index, indexer, span, e.maxRetries); err != nil {
			errs = append(errs, err)
		}
	}

	return multierr.Combine(errs...)
}
