package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/exporter/exporterhelper"
)

const (
	typeStr = "elasticsearch"
)

func NewFactory() component.ExporterFactory {
	return component.NewExporterFactory(
		typeStr,
		createDefaultConfig,
		component.WithTracesExporter(createTracesExporter, component.StabilityLevelInDevelopment),
	)
}

// Temporary settings for build purposes
func createDefaultConfig() config.Exporter {
	return &Config{
		ExporterSettings: config.NewExporterSettings(config.NewComponentID(typeStr)),
		Index:            "lupa-traces",
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
	var err error

	exporter, err := newTracesExporter(set.Logger, cfg.(*Config))

	if err != nil {
		return nil, fmt.Errorf("Could not create traces exporter: %+v", err)
	}

	return exporterhelper.NewTracesExporter(ctx, set, cfg,
		exporter.writeTraceRecord,
		exporterhelper.WithShutdown(exporter.Shutdown))
}
