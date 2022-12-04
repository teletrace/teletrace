package sqlite

import "oss-tracing/pkg/config"

type SqliteConfig struct {
	Path string
}

func NewSqliteConfig(cfg config.Config) SqliteConfig {
	return SqliteConfig{
		Path: cfg.SQLitePath,
	}
}
