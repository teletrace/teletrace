/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package opensearchexporter

import (
	"errors"
	"time"

	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for OpenSearch exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`

	// Endpoints holds the OpenSearch URLs the exporter sends InternalSpans to
	Endpoints []string `mapstructure:"endpoints"`

	// WorkersCount sets the Indexer workers count
	WorkersCount int `mapstructure:"workers_count"`

	// Defaults to teletrace-traces
	Index string `mapstructure:"index"`

	// Username is used to configure HTTP Basic Authentication.
	// If set, password must be set as well
	Username string `mapstructure:"username"`

	// Password is used to configure HTTP Basic Authentication.
	Password string `mapstructure:"password"`

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
	errConfigNoEndpoint    = errors.New("endpoints must be specified")
	errConfigEmptyEndpoint = errors.New("endpoints must not include empty entries")
)

// Validate validates the OpenSearch server configuration.
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
