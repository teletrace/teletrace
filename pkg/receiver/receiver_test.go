package receiver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"oss-tracing/pkg/config"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.opentelemetry.io/collector/component"
	otelcfg "go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"
)

func TestReceiverStartAndShutdown(t *testing.T) {
	cfg := config.Config{
		GRPCEndpoint: "0.0.0.0:1234",
		HTTPEndpoint: "0.0.0.0:4321",
	}
	logger, observedLogs := getLoggerObserver()

	receiver, err := NewReceiver(cfg, logger, nil)
	assert.NoError(t, err)
	assert.NoError(t, receiver.Start())
	defer func() {
		assert.NoError(t, receiver.Shutdown())
	}()
	grpcServerLog := observedLogs.FilterMessage(fmt.Sprintf("Starting GRPC server on endpoint %s", cfg.GRPCEndpoint))
	assert.Equal(t, 1, grpcServerLog.Len())
	httpServerLog := observedLogs.FilterMessage(fmt.Sprintf("Starting HTTP server on endpoint %s", cfg.HTTPEndpoint))
	assert.Equal(t, 1, httpServerLog.Len())
}

func TestReceiverTracesProcessor(t *testing.T) {
	cfg := config.Config{
		GRPCEndpoint: "0.0.0.0:1234",
		HTTPEndpoint: "0.0.0.0:4321",
	}
	logger, observedLogs := getLoggerObserver()
	tracesProcessor := func(ctx context.Context, processorLogger *zap.Logger, td ptrace.Traces) error {
		processorLogger.Info("Received traces")
		receivedSpan := td.ResourceSpans().At(0).ScopeSpans().At(0).Spans().At(0)
		assert.Equal(t, "fakeSpan", receivedSpan.Name())
		return nil
	}

	receiver, err := NewReceiver(cfg, logger, tracesProcessor)
	assert.NoError(t, err)
	assert.NoError(t, receiver.Start())
	defer func() {
		assert.NoError(t, receiver.Shutdown())
	}()

	reqBody := strings.NewReader(`
	{
		"resource_spans": [
		  {
			"scope_spans": [
			  {
				"spans": [
				  {
					"name": "fakeSpan"
				  }
				]
			  }
			]
		  }
		]
	  }
	`)
	resp, _ := http.Post(fmt.Sprintf("http://%s/v1/traces", cfg.HTTPEndpoint), "application/json", reqBody)
	assert.Equal(t, 200, resp.StatusCode)
	// Apart from ensuring processor invocation, it also validates the correct logger is used
	processorLog := observedLogs.FilterMessage("Received traces")
	assert.Equal(t, 1, processorLog.Len())
}

func TestReceiverConfig(t *testing.T) {
	otlpFactory := otlpreceiver.NewFactory()
	cfg := config.Config{
		GRPCEndpoint: "0.0.0.0:1234",
		HTTPEndpoint: "0.0.0.0:4321",
	}

	receiverCfg := getOtlpReceiverConfig(otlpFactory, cfg)

	assert.Equal(t, cfg.GRPCEndpoint, receiverCfg.GRPC.NetAddr.Endpoint)
	assert.Equal(t, cfg.HTTPEndpoint, receiverCfg.HTTP.Endpoint)
}

func TestOtelHostNoopMethods(t *testing.T) {
	host := otelHost{}

	assert.Nil(t, host.GetFactory(component.KindReceiver, otelcfg.TracesDataType))
	assert.Nil(t, host.GetExtensions())
	assert.Nil(t, host.GetExporters())
}

func TestOtelHostReportFatalError(t *testing.T) {
	fakeLogger, observedLogs := getLoggerObserver()

	host := otelHost{logger: fakeLogger}
	// ReportFatalError calls logger.Fatal, panic only used for recovery in tests
	assert.Panics(t, func() { host.ReportFatalError(errors.New("Example error")) })

	assert.Equal(t, 1, observedLogs.Len())
	log := observedLogs.All()[0]
	assert.Equal(t, "OTLP receiver error", log.Entry.Message)
	assert.Equal(t, zap.FatalLevel, log.Entry.Level)
	assert.Equal(t, "Example error", log.ContextMap()["error"])
}

func getLoggerObserver() (*zap.Logger, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore, zap.WithFatalHook(zapcore.WriteThenPanic))
	return fakeLogger, observedLogs
}
