package sqlite

import (
	"go.opentelemetry.io/collector/config"
)

type Config struct {
	config.ExporterSettings `mapstructure:",squash"`
	DBSettings              SqliteConfig `mapstructure:"db"`
}

type SqliteConfig struct {
	Path string
}

func NewSqliteConfig(path string) SqliteConfig {
	return SqliteConfig{
		Path: path,
	}
}
