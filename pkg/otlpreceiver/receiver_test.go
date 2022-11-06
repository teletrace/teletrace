package otlpreceiver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"oss-tracing/pkg/config"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.opentelemetry.io/collector/component"
	otelcfg "go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.opentelemetry.io/collector/pdata/ptrace/ptraceotlp"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func TestReceiverGRPCEndpoint(t *testing.T) {
	spanName := "fakeSpan"
	receivedSpanLog := "Received span"
	cfg := config.Config{GRPCEndpoint: "0.0.0.0:1234"}
	logger, observedLogs := getLoggerObserver()
	tracesProcessor := func(ctx context.Context, processorLogger *zap.Logger, td ptrace.Traces) error {
		receivedSpan := td.ResourceSpans().At(0).ScopeSpans().At(0).Spans().At(0)
		processorLogger.Info(receivedSpanLog, zap.String("span_name", receivedSpan.Name()))
		return nil
	}

	receiver, err := NewOtlpReceiver(cfg, logger, tracesProcessor)
	assert.NoError(t, err)
	assert.NoError(t, receiver.Start())
	defer func() {
		assert.NoError(t, receiver.Shutdown())
	}()

	dialCtx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	grpcClient, err := grpc.DialContext(
		dialCtx,
		cfg.GRPCEndpoint,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	require.NoError(t, err)
	defer func() {
		assert.NoError(t, grpcClient.Close())
	}()
	td := createTracesTestSpan(spanName)
	require.NoError(t, exportTraces(grpcClient, td))

	processorLog := observedLogs.FilterMessage(receivedSpanLog)
	assert.Equal(t, 1, processorLog.Len())
	processorLogFields := processorLog.All()[0].ContextMap()
	assert.Equal(t, spanName, processorLogFields["span_name"])
}

func getLoggerObserver() (*zap.Logger, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	// WithFatalHook is used to avoid exiting during tests
	fakeLogger := zap.New(zapCore, zap.WithFatalHook(zapcore.WriteThenPanic))
	return fakeLogger, observedLogs
}

func createTracesTestSpan(spanName string) ptrace.Traces {
	traces := ptrace.NewTraces()
	span := traces.ResourceSpans().AppendEmpty().ScopeSpans().AppendEmpty().Spans().AppendEmpty()
	span.SetName(spanName)
	return traces
}

func exportTraces(grpcClient *grpc.ClientConn, td ptrace.Traces) error {
	otlpClient := ptraceotlp.NewClient(grpcClient)
	req := ptraceotlp.NewRequestFromTraces(td)
	_, err := otlpClient.Export(context.Background(), req)
	return err
}

func TestReceiverHTTPEndpoint(t *testing.T) {
	spanName := "fakeSpan"
	receivedSpanLog := "Received span"
	cfg := config.Config{HTTPEndpoint: "0.0.0.0:4321"}
	logger, observedLogs := getLoggerObserver()
	tracesProcessor := func(ctx context.Context, processorLogger *zap.Logger, td ptrace.Traces) error {
		receivedSpan := td.ResourceSpans().At(0).ScopeSpans().At(0).Spans().At(0)
		processorLogger.Info(receivedSpanLog, zap.String("span_name", receivedSpan.Name()))
		return nil
	}

	receiver, err := NewOtlpReceiver(cfg, logger, tracesProcessor)
	assert.NoError(t, err)
	assert.NoError(t, receiver.Start())
	defer func() {
		assert.NoError(t, receiver.Shutdown())
	}()

	reqBody := strings.NewReader(fmt.Sprintf(`
	{
		"resource_spans": [
		  {
			"scope_spans": [
			  {
				"spans": [
				  {
					"name": "%s"
				  }
				]
			  }
			]
		  }
		]
	  }
	`, spanName))
	resp, _ := http.Post(fmt.Sprintf("http://%s/v1/traces", cfg.HTTPEndpoint), "application/json", reqBody)
	assert.Equal(t, 200, resp.StatusCode)

	processorLog := observedLogs.FilterMessage(receivedSpanLog)
	assert.Equal(t, 1, processorLog.Len())
	processorLogFields := processorLog.All()[0].ContextMap()
	assert.Equal(t, spanName, processorLogFields["span_name"])
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
