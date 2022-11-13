package elasticsearchexporter

import (
	"errors"
	"time"

	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for Elastic exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`

	// Endpoints holds the Elasticsearch URLs the exporter sends InternalSpans to
	Endpoints []string `mapstructure:"endpoints"`

	// WorkersCount sets the Indexer workers count
	WorkersCount int `mapstructure:"workers_count"`

	// Defaults to lupa_spans
	Index string `mapstructure:"index"`

	// Username is used to configure HTTP Basic Authentication.
	// If set, password must be set as well
	Username string `mapstructure:"username"`

	// Password is used to configure HTTP Basic Authentication.
	Password string `mapstructure:"password"`

	// APIKey is used to configure ApiKey based Authentication.
	APIKey string `mapstructure:"api_key"`

	// Indexer flush settings, affects span buffer in memory.
	Flush FlushSettings `mapstructure:"flush"`

	// Indexer retry mechanism
	Retry RetrySettings `mapstructure:"retry"`
}

type FlushSettings struct {
	// Bytes sets the send buffer flushing limit.
	Bytes int `mapstructure:"bytes"`

	// Interval configures the max age of a document in the send buffer.
	Interval time.Duration `mapstructure:"interval"`
}

type RetrySettings struct {
	Enabled bool `mapstructure:"enabled"`

	MaxRetries int `mapstructure:"max_retries"`
}

var (
	errConfigNoEndpoint    = errors.New("endpoints specified")
	errConfigEmptyEndpoint = errors.New("endpoints must not include empty entries")
)

// Validate validates the elasticsearch server configuration.
func (cfg *Config) Validate() error {
	if len(cfg.Endpoints) == 0 {
		return errConfigNoEndpoint
	}

	for _, endpoint := range cfg.Endpoints {
		if endpoint == "" {
			return errConfigEmptyEndpoint
		}
	}

	return nil
}
