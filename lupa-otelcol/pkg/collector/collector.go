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

// Start runs the collector and blocks the goroutine indefinitely unless an error happens.
func (c *Collector) Start() error {
	cmd := service.NewCommand(c.settings)
	if err := cmd.Execute(); err != nil {
		return fmt.Errorf("collector server stopped with an error: %w", err)
	}
	return nil
}
