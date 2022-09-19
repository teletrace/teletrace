package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"oss-tracing/pkg/config"
	"oss-tracing/pkg/logs"
	"oss-tracing/pkg/receiver"

	"go.uber.org/zap"
)

func main() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Failed to initialize config: %v", err)
	}

	logger, err := logs.NewLogger(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logs.FlushBufferedLogs(logger)

	receiver, err := receiver.NewReceiver(cfg, logger)
	if err != nil {
		logger.Fatal("Failed to initialize receiver", zap.Error(err))
	}

	if err := receiver.Start(); err != nil {
		logger.Fatal("Could not start receiver", zap.Error(err))
	}

	signalsChan := make(chan os.Signal, 1)
	signal.Notify(signalsChan, os.Interrupt, syscall.SIGTERM)
	for sig := range signalsChan {
		logger.Warn("Received system signal", zap.String("signal", sig.String()))
		break
	}
	if err := receiver.Shutdown(); err != nil {
		logger.Fatal("Failed to shut down receiver gracefully", zap.Error(err))
	}
}
