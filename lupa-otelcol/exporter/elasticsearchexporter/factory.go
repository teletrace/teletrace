package elasticsearchexporter

import (
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
	)
}

// Temporary settings for build purposes
func createDefaultConfig() component.ExporterConfig {
	cfg := config.NewExporterSettings(component.NewID(typeStr))
	return &cfg
}
