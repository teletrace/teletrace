package sqliteexporter

import (
	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for SQLite exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`
	DBSettings              DBSettings `mapstructure:"db"`
}

type DBSettings struct {
	// Path is where the embedded database will be created.
	Path string `mapstructure:"path"`
}

// Validate validates the SQLite exporter configuration.
func (cfg *Config) Validate() error {
	return nil
}
