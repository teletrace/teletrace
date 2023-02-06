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

package collector

import (
	"fmt"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/opensearchexporter"

	"github.com/epsagon/lupa/lupa-otelcol/exporter/elasticsearchexporter"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/sqliteexporter"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/attributesprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/transformprocessor"
	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/processor/batchprocessor"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"
)

func components() (component.Factories, error) {
	receivers, err := component.MakeReceiverFactoryMap(
		otlpreceiver.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, fmt.Errorf("failed to make receiver factory map: %w", err)
	}

	processors, err := component.MakeProcessorFactoryMap(
		batchprocessor.NewFactory(),
		attributesprocessor.NewFactory(),
		transformprocessor.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, fmt.Errorf("failed to make processor factory map: %w", err)
	}

	exporters, err := component.MakeExporterFactoryMap(
		elasticsearchexporter.NewFactory(),
		opensearchexporter.NewFactory(),
		sqliteexporter.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, fmt.Errorf("failed to make exporter factory map: %w", err)
	}

	factories := component.Factories{
		Receivers:  receivers,
		Processors: processors,
		Exporters:  exporters,
	}

	return factories, nil
}
