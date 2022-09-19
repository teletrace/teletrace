package receiver

import (
	"context"
	"fmt"
	"log"
	"time"

	"oss-tracing/pkg/config"

	"go.opentelemetry.io/collector/component"
	otelcfg "go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/consumer"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"

	"go.uber.org/zap"
)

type Receiver struct {
	logger   *zap.Logger
	receiver component.TracesReceiver
}

// TODO: should receive spanProcessor (not sure what interface)
func NewReceiver(cfg config.Config, logger *zap.Logger) (*Receiver, error) {
	otlpFactory := otlpreceiver.NewFactory()
	otlpReceiverConfig := getOtlpReceiverConfig(otlpFactory, cfg)
	otlpReceiverSettings := getOtlpReceiverSettings(logger)

	consumer, err := consumer.NewTraces(consume)
	if err != nil {
		return nil, fmt.Errorf("could not create OTLP consumer: %w", err)
	}

	otlpReceiver, err := otlpFactory.CreateTracesReceiver(context.Background(), otlpReceiverSettings, otlpReceiverConfig, consumer)
	if err != nil {
		return nil, fmt.Errorf("could not create OTLP receiver: %w", err)
	}

	r := &Receiver{
		logger:   logger,
		receiver: otlpReceiver,
	}
	return r, nil
}

func getOtlpReceiverConfig(otlpFactory component.ReceiverFactory, cfg config.Config) *otlpreceiver.Config {
	otlpReceiverConfig := otlpFactory.CreateDefaultConfig().(*otlpreceiver.Config)
	otlpReceiverConfig.GRPC.NetAddr.Endpoint = cfg.GRPCEndpoint
	otlpReceiverConfig.HTTP.Endpoint = cfg.HTTPEndpoint
	return otlpReceiverConfig
}

func getOtlpReceiverSettings(logger *zap.Logger) component.ReceiverCreateSettings {
	receiverSettings := component.ReceiverCreateSettings{
		TelemetrySettings: component.TelemetrySettings{
			Logger: logger,
		},
	}
	return receiverSettings
}

func consume(ctx context.Context, ld ptrace.Traces) error {
	log.Fatal(("asdf"))
	fmt.Println(ld)
	return nil
}

func (r *Receiver) Start() error {
	err := r.receiver.Start(context.Background(), &otelHost{logger: r.logger})
	if err != nil {
		return fmt.Errorf("could not start the OTLP receiver: %w", err)
	}
	return nil
}

type otelHost struct {
	logger *zap.Logger
}

func (h *otelHost) ReportFatalError(err error) {
	h.logger.Fatal("OTLP receiver error", zap.Error(err))
}

func (*otelHost) GetFactory(_ component.Kind, _ otelcfg.Type) component.Factory {
	return nil
}

func (*otelHost) GetExtensions() map[otelcfg.ComponentID]component.Extension {
	return nil
}

func (*otelHost) GetExporters() map[otelcfg.DataType]map[otelcfg.ComponentID]component.Exporter {
	return nil
}

func (r *Receiver) Shutdown() error {
	timeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := r.receiver.Shutdown(timeout); err != nil {
		return fmt.Errorf("failed to stop OTLP receiver: %w", err)
	}
	return nil
}
