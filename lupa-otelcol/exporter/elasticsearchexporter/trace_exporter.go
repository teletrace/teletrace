package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/multierr"
	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esutil"
	"github.com/epsagon/lupa/lupa-otelcol/exporter/elasticsearchexporter/internal/modeltranslator"
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

func (e *elasticsearchTracesExporter) pushTracesData(ctx context.Context, td ptrace.Traces) error {
	var errs []error
	internalSpans := modeltranslator.TranslateOTLPToInternalSpans(td)

	for _, span := range internalSpans {
		err := writeSpan(ctx, e.logger, e.idx, e.bulkIndexer, span, e.maxRetries)
		if err != nil {
			if cerr := ctx.Err(); cerr != nil {
				return cerr
			}
			errs = append(errs, err)
		}
	}

	return multierr.Combine(errs...)
}
