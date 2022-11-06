package app

import (
	"context"
	"fmt"
	"oss-tracing/pkg/config"
	v1 "oss-tracing/pkg/model/internalspan/v1"
	"oss-tracing/pkg/modeltranslator"
	"oss-tracing/pkg/otlpreceiver"
	"oss-tracing/pkg/queue"
	storage "oss-tracing/pkg/spanstorage"
	"time"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

// Collector holds the config used for running the collector
// as well as methods to run and stop it.
type Collector struct {
	cfg          config.Config
	logger       *zap.Logger
	otlpQueue    *queue.BoundedQueue
	spansQueue   *queue.BoundedQueue
	otlpReceiver *otlpreceiver.OtlpReceiver
	spanStorage  storage.Storage
}

// NewCollector creates the relevant collector components and returns a new Collector instance.
func NewCollector(cfg config.Config, logger *zap.Logger, spanStorage storage.Storage) (*Collector, error) {
	otlpQueue, err := queue.NewBoundedQueue(cfg.OTLPQueueSize)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize OTLP queue: %w", err)
	}

	spansQueue, err := queue.NewBoundedQueue(cfg.SpansQueueSize)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize spans queue: %w", err)
	}

	otlpReceiver, err := otlpreceiver.NewOtlpReceiver(cfg, logger, getOTLPEnqueuer(otlpQueue))
	if err != nil {
		return nil, fmt.Errorf("failed to initialize OTLP receiver: %w", err)
	}

	return &Collector{
		cfg:          cfg,
		logger:       logger,
		spanStorage:  spanStorage,
		otlpQueue:    otlpQueue,
		spansQueue:   spansQueue,
		otlpReceiver: otlpReceiver,
	}, nil
}

func getOTLPEnqueuer(otlpQueue *queue.BoundedQueue) func(ctx context.Context, logger *zap.Logger, td ptrace.Traces) error {
	return func(ctx context.Context, logger *zap.Logger, td ptrace.Traces) error {
		ok := otlpQueue.Enqueue(td)
		if !ok {
			logger.Error("Failed to enqueue OTLP traces", zap.Int("span_count", td.SpanCount()))
		}
		return nil
	}
}

// Start runs the collector components and starts the spans ingestion process.
func (c *Collector) Start() error {
	if err := c.spanStorage.Initialize(); err != nil {
		return fmt.Errorf("failed to initialize spans storage: %w", err)
	}

	c.otlpQueue.StartConsumers(c.getOTLPTranslatorConsumer(), c.cfg.OTLPQueueWorkersCount)
	c.spansQueue.StartConsumers(c.getSpansWriterConsumer(), c.cfg.SpansQueueWorkersCount)

	if err := c.otlpReceiver.Start(); err != nil {
		return fmt.Errorf("failed to start OTLP receiver: %w", err)
	}

	return nil
}

func (c *Collector) getOTLPTranslatorConsumer() func(item interface{}) {
	return func(item interface{}) {
		internalSpans := modeltranslator.TranslateOTLPToInternalModel(item.(ptrace.Traces))
		ok := c.spansQueue.Enqueue(internalSpans)
		if !ok {
			c.logger.Error("Failed to enqueue translated spans", zap.Int("span_count", len(internalSpans)))
		}
	}
}

func (c *Collector) getSpansWriterConsumer() func(item interface{}) {
	return func(item interface{}) {
		spanWriter, err := c.spanStorage.CreateSpanWriter()
		if err != nil {
			c.logger.Error("Failed to create span writer", zap.Error(err))
		} else {
			err := spanWriter.WriteBulk(context.Background(), item.([]*v1.InternalSpan)...)
			if err != nil {
				c.logger.Error("Failed to write spans to spans storage", zap.Error(err))
			}
		}
	}
}

// Stop attempts to gracefully stop all of the collector components.
// Blocks until all components are stopped or times out.
func (c *Collector) Stop() {
	if err := c.otlpReceiver.Shutdown(); err != nil {
		c.logger.Error("Failed to gracefully shut down OTLP receiver", zap.Error(err))
	}

	otlpQueueTimeout := time.Duration(c.cfg.OTLPQueueShutdownTimeoutSeconds) * time.Second
	if err := c.otlpQueue.Stop(otlpQueueTimeout); err != nil {
		c.logger.Error("Failed to gracefully stop OTLP queue", zap.Error(err))
	}

	spansQueueTimeout := time.Duration(c.cfg.SpansQueueShutdownTimeoutSeconds) * time.Second
	if err := c.spansQueue.Stop(spansQueueTimeout); err != nil {
		c.logger.Error("Failed to gracefully stop spans queue", zap.Error(err))
	}
}
