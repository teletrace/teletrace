package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esutil"
	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
)

type elasticsearchTracesExporter struct {
	logger *zap.Logger

	idx         string
	client      *elasticsearch.Client
	bulkIndexer esutil.BulkIndexer
	maxRetries  int
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*elasticsearchTracesExporter, error) {
	errMsg := "could not create a new traces exporter: %+v"

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	esClient, err := newClient(logger, cfg)

	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	bi, err := newBulkIndexer(logger, esClient, cfg)

	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	maxRetries := 1
	if cfg.Retry.Enabled {
		maxRetries = cfg.Retry.MaxRetries
	}

	return &elasticsearchTracesExporter{
		logger:      logger,
		idx:         cfg.Index,
		client:      esClient,
		bulkIndexer: bi,
		maxRetries:  maxRetries,
	}, nil

}

func (e *elasticsearchTracesExporter) Shutdown(ctx context.Context) error {
	return e.bulkIndexer.Close(ctx)
}

func (e *elasticsearchTracesExporter) writeTraceRecord(ctx context.Context, ld ptrace.Traces) error {
	return nil
}

func (e *elasticsearchTracesExporter) writeInternalSpan(ctx context.Context, span internalspanv1.InternalSpan) error {
	return nil
}
