package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/exporter/exporterhelper"
)

const (
	typeStr      = "elasticsearch"
	stability    = component.StabilityLevelInDevelopment
	defaultIndex = "lupa-traces"
)

func NewFactory() component.ExporterFactory {
	return component.NewExporterFactory(
		typeStr,
		createDefaultConfig,
		component.WithTracesExporter(createTracesExporter, stability),
	)
}

func createDefaultConfig() component.ExporterConfig {
	return &Config{
		ExporterSettings: config.NewExporterSettings(component.NewID(typeStr)),
		Index:            defaultIndex,
		WorkersCount:     1,
		Flush: FlushSettings{
			Interval: 30,
			Bytes:    10000,
		},
		Retry: RetrySettings{
			Enabled:    true,
			MaxRetries: 3,
		},
	}
}

func createTracesExporter(
	ctx context.Context,
	set component.ExporterCreateSettings,
	cfg component.ExporterConfig,
) (component.TracesExporter, error) {
	exporter, err := newTracesExporter(set.Logger, cfg.(*Config))
	if err != nil {
		return nil, fmt.Errorf("could not create traces exporter: %w", err)
	}

	return exporterhelper.NewTracesExporter(
		ctx, set, cfg,
		exporter.pushTraceData,
		exporterhelper.WithShutdown(exporter.Shutdown),
	)
}
