package elasticsearchexporter

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esutil"
)

func newClient(logger *zap.Logger, cfg *Config) (*elasticsearch.Client, error) {
	esConfig, err := elasticsearch.NewClient(elasticsearch.Config{

		// basic connection setup
		Addresses: cfg.Endpoints,
		Username:  cfg.Username,
		Password:  cfg.Password,
		APIKey:    cfg.APIKey,
	})

	if err != nil {
		return nil, fmt.Errorf("Error creating Elasticsearch Client: %+v", err)
	}

	return esConfig, nil
}

func newBulkIndexer(logger *zap.Logger, client *elasticsearch.Client, cfg *Config) (esutil.BulkIndexer, error) {
	var err error

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         cfg.Index,
		Client:        client,
		NumWorkers:    cfg.WorkersCount,
		FlushInterval: cfg.Flush.Interval,
		FlushBytes:    cfg.Flush.Bytes,

		OnError: func(_ context.Context, err error) {
			logger.Error(fmt.Sprintf("bulk indexer error: %v", err))
		},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating the indexer: %v", err)
	}

	return bi, nil
}
