package collector

import (
	"fmt"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/service"
)

type Collector struct {
	settings service.CollectorSettings
}

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

func (c *Collector) Start() error {
	cmd := service.NewCommand(c.settings)
	if err := cmd.Execute(); err != nil {
		return fmt.Errorf("collector server run finished with error: %w", err)
	}
	return nil
}
