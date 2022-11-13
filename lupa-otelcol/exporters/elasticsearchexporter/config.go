package elasticsearchexporter

import (
	"errors"
	"os"
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

	// defaults to lupa_spans
	Index string `mapstructure:"index"`

	// If set, password must be set as well
	Username string `mapstructure:"user"`

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

// RetrySettings defines settings for the HTTP request retries in the Elasticsearch exporter.
// Failed sends are retried with exponential backoff.
type RetrySettings struct {
	// Enabled allows users to disable retry without having to comment out all settings.
	Enabled bool `mapstructure:"enabled"`

	// MaxRequests configures how often an HTTP request is retried before it is assumed to be failed.
	MaxRequests int `mapstructure:"max_requests"`

	// InitialInterval configures the initial waiting time if a request failed.
	InitialInterval time.Duration `mapstructure:"initial_interval"`

	// MaxInterval configures the max waiting time if consecutive requests failed.
	MaxInterval time.Duration `mapstructure:"max_interval"`
}

var (
	errConfigNoEndpoint    = errors.New("endpoints or cloudid must be specified")
	errConfigEmptyEndpoint = errors.New("endpoints must not include empty entries")
)

const defaultElasticsearchEnvName = "ELASTICSEARCH_URL"

// Validate validates the elasticsearch server configuration.
func (cfg *Config) Validate() error {
	if len(cfg.Endpoints) == 0 {
		if os.Getenv(defaultElasticsearchEnvName) == "" {
			return errConfigNoEndpoint
		}
	}

	for _, endpoint := range cfg.Endpoints {
		if endpoint == "" {
			return errConfigEmptyEndpoint
		}
	}

	return nil
}
