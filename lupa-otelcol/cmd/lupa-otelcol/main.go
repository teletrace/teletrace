package main

import (
	"fmt"
	"log"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/service"
)

func main() {
	factories, err := components()
	if err != nil {
		log.Fatalf("failed to build components: %v", err)
	}

	info := component.BuildInfo{
		Command:     "lupa-otelcol",
		Description: "Lupa OpenTelemetry Collector",
		Version:     "0.0.0",
	}

	params := service.CollectorSettings{
		BuildInfo: info,
		Factories: factories,
	}

	if err = runInteractive(params); err != nil {
		log.Fatal(err)
	}
}

func runInteractive(params service.CollectorSettings) error {
	cmd := service.NewCommand(params)
	if err := cmd.Execute(); err != nil {
		return fmt.Errorf("collector server run finished with error: %w", err)
	}
	return nil
}
