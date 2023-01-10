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

package collector

import (
	"fmt"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/service"
)

// Collector holds the collector settings and provides a method to start it.
type Collector struct {
	settings service.CollectorSettings
}

// NewCollector loads the collector components and returns a new Collector instance.
func NewCollector() (*Collector, error) {
	factories, err := components()
	if err != nil {
		return nil, fmt.Errorf("failed to build components: %w", err)
	}

	info := component.BuildInfo{
		Command:     "lupa-otelcol",
		Description: "Lupa OpenTelemetry Collector",
		Version:     "0.0.0",
	}

	settings := service.CollectorSettings{
		BuildInfo: info,
		Factories: factories,
	}

	return &Collector{
		settings: settings,
	}, nil
}

func someFunction() {
}

// Start runs the collector and blocks the goroutine indefinitely unless an error happens.
func (c *Collector) Start() error {
	cmd := service.NewCommand(c.settings)
	if err := cmd.Execute(); err != nil {
		return fmt.Errorf("collector server stopped with an error: %w", err)
	}
	return nil
}
