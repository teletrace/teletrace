package sqliteexporter

import (
	"fmt"
	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for SQLite exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`

	// Path is the sqlite instance full path.
	Path string `mapstructure:"path"`
}

// Validate validates the SQLite exporter configuration.
func (cfg *Config) Validate() error {
	if cfg.Path == "" {
		return fmt.Errorf("SQLite exporter requires a path, examples: '/database/my_spans.db'")
	}

	return nil
}
