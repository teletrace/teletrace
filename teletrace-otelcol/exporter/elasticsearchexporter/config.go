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

package elasticsearchexporter

import (
	"errors"

	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for Elastic exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`

	// Endpoints holds the Elasticsearch URLs the exporter sends InternalSpans to
	Endpoints []string `mapstructure:"endpoints"`

	// Defaults to teletrace_spans
	Index string `mapstructure:"index"`

	// Username is used to configure HTTP Basic Authentication.
	// If set, password must be set as well
	Username string `mapstructure:"username"`

	// Password is used to configure HTTP Basic Authentication.
	Password string `mapstructure:"password"`

	// APIKey is used to configure ApiKey based Authentication.
	APIKey string `mapstructure:"api_key"`
}

var (
	errConfigNoEndpoint    = errors.New("endpoints must be specified")
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
