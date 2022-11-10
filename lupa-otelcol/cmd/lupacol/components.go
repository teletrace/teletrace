package main

import (
	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/exporter/otlpexporter"
	"go.opentelemetry.io/collector/processor/batchprocessor"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"

	"github.com/epsagon/lupa/lupa-otelcol/exporter/elasticsearchexporter"
)

func components() (component.Factories, error) {
	receivers, err := component.MakeReceiverFactoryMap(
		otlpreceiver.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, err
	}

	processors, err := component.MakeProcessorFactoryMap(
		batchprocessor.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, err
	}

	exporters, err := component.MakeExporterFactoryMap(
		elasticsearchexporter.NewFactory(),

		// Temporary until ES implementation, used for build purposes
		otlpexporter.NewFactory(),
	)
	if err != nil {
		return component.Factories{}, err
	}

	factories := component.Factories{
		Receivers:  receivers,
		Processors: processors,
		Exporters:  exporters,
	}

	return factories, nil
}
