/**
 * Copyright 2022 Epsagon
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
