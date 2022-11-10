package elasticsearchexporter

import (
	"context"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/config"
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
func createDefaultConfig() component.ExporterConfig {
	cfg := config.NewExporterSettings(component.NewID(typeStr))
	return &cfg
}

func createTracesExporter(
	context.Context,
	component.ExporterCreateSettings,
	component.ExporterConfig,
) (component.TracesExporter, error) {
	return nil, nil
}
