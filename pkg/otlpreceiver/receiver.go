package otlpreceiver

import (
	"context"
	"fmt"
	"time"

	"oss-tracing/pkg/config"

	"go.opentelemetry.io/collector/component"
	otelcfg "go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/consumer"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

// otlpReceiver handles incoming OTLP traces and registers consumers
type OtlpReceiver struct {
	logger   *zap.Logger
	receiver component.TracesReceiver
}

// TracesProcessor consumes the received OTLP traces
type TracesProcessor func(ctx context.Context, logger *zap.Logger, td ptrace.Traces) error

func NewOtlpReceiver(cfg config.Config, logger *zap.Logger, tracesProcessor TracesProcessor) (*OtlpReceiver, error) {
	otlpFactory := otlpreceiver.NewFactory()
	otlpSettings := getOtlpReceiverSettings(logger)
	otlpConfig := getOtlpReceiverConfig(otlpFactory, cfg)

	otlpConsumer, err := consumer.NewTraces(wrapWithLogger(tracesProcessor, logger))
	if err != nil {
		return nil, fmt.Errorf("could not create OTLP consumer: %w", err)
	}

	receiver, err := otlpFactory.CreateTracesReceiver(
		context.Background(), otlpSettings, otlpConfig, otlpConsumer,
	)
	if err != nil {
		return nil, fmt.Errorf("could not create OTLP receiver: %w", err)
	}

	return &OtlpReceiver{
		logger:   logger,
		receiver: receiver,
	}, nil
}

func getOtlpReceiverSettings(logger *zap.Logger) component.ReceiverCreateSettings {
	otlpReceiverSettings := component.ReceiverCreateSettings{
		TelemetrySettings: component.TelemetrySettings{
			Logger:         logger,
			TracerProvider: trace.NewNoopTracerProvider(),
		},
	}
	return otlpReceiverSettings
}

func getOtlpReceiverConfig(otlpFactory component.ReceiverFactory, cfg config.Config) *otlpreceiver.Config {
	otlpReceiverCfg := otlpFactory.CreateDefaultConfig().(*otlpreceiver.Config)
	otlpReceiverCfg.GRPC.NetAddr.Endpoint = cfg.GRPCEndpoint
	otlpReceiverCfg.HTTP.Endpoint = cfg.HTTPEndpoint
	return otlpReceiverCfg
}

func wrapWithLogger(tracesProcessor TracesProcessor, logger *zap.Logger) func(ctx context.Context, td ptrace.Traces) error {
	return func(ctx context.Context, td ptrace.Traces) error {
		return tracesProcessor(ctx, logger, td)
	}
}

// Start runs the receiver in the background
func (r *OtlpReceiver) Start() error {
	err := r.receiver.Start(context.Background(), &otelHost{logger: r.logger})
	if err != nil {
		return fmt.Errorf("could not start OTLP receiver: %w", err)
	}
	return nil
}

// no-op implementation of OTEL collector component.Host
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

// Shutdown stops and gracefully shuts down the receiver
func (r *OtlpReceiver) Shutdown() error {
	timeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := r.receiver.Shutdown(timeout); err != nil {
		return fmt.Errorf("failed to stop OTLP receiver: %w", err)
	}
	return nil
}
