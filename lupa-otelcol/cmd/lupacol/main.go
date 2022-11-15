package main

import (
	"log"

	"github.com/epsagon/lupa/lupa-otelcol/pkg/collector"
)

func main() {
	collector, err := collector.NewCollector()
	if err != nil {
		log.Fatalf("Failed to initialize collector: %v", err)
	}

	if err = collector.Start(); err != nil {
		log.Fatalf("Collector stopped with an error: %v", err)
	}
}
