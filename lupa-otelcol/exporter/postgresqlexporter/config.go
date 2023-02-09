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

package postgresqlexporter

import (
	"fmt"

	"go.opentelemetry.io/collector/config"
)

// Config defines configuration for PostgreSQL exporter.
type Config struct {
	config.ExporterSettings `mapstructure:",squash"`

	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DbName   string `mapstructure:"dbname"`
}

// Validate validates the PostgreSQL exporter configuration.
func (cfg *Config) Validate() error {
	if cfg.Host == "" {
		return fmt.Errorf("PostgreSQL exporter requires a host, examples: 'http://localhost'")
	}

	if cfg.Port == 0 {
		return fmt.Errorf("PostgreSQL exporter requires a port, example: 5432")
	}

	if cfg.User == "" {
		return fmt.Errorf("PostgreSQL exporter requires a user, examples: 'postgres'")
	}

	if cfg.Password == "" {
		return fmt.Errorf("PostgreSQL exporter requires a password, examples: 'postgres'")
	}

	if cfg.DbName == "" {
		return fmt.Errorf("PostgreSQL exporter requires a dbname, examples: 'spans'")
	}

	return nil
}
