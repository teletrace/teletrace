package receiver

import (
	"errors"
	"oss-tracing/pkg/config"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.opentelemetry.io/collector/component"
	otelcfg "go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"
)

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

	// actually calls os.Exit(1), panic only used for recovery in tests
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
