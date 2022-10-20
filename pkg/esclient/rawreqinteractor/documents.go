package rawreqinteractor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"time"

	"github.com/elastic/go-elasticsearch/v8/esutil"
	"go.uber.org/zap"
)

func Bulk(ctx context.Context, c Client, idx string, docs ...*interactor.Doc) error {
	var err error

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         idx,
		Client:        c.Client,
		NumWorkers:    1,
		FlushInterval: 30 * time.Second,
	})

	if err != nil {
		return fmt.Errorf("Error creating the indexer: %+v", err)
	}

	err = bulk(ctx, c.Logger, bi, idx, docs...)

	if err != nil {
		return fmt.Errorf("Error bulk-indexing documents: %+v", err)
	}

	err = bi.Close(context.Background())

	if err != nil {
		return fmt.Errorf("Could not close the Bulk Indexer: %+v", err)
	}

	biStats := bi.Stats()
	c.Logger.Sugar().Debugf("BiStats: %+v", biStats)

	return nil
}

func bulk(ctx context.Context, logger *zap.Logger, bi esutil.BulkIndexer, idx string, docs ...*interactor.Doc) error {
	for _, doc := range docs {
		var err error
		var failures []error // will not throw exception

		data, err := json.Marshal(&doc)

		if err != nil {
			return fmt.Errorf("Could not json marshal doc %+v: %+v", doc, err)
		}

		err = bi.Add(
			ctx,
			esutil.BulkIndexerItem{
				Action: "create",
				Body:   bytes.NewReader(data),
				OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
					failures = append(failures, fmt.Errorf("Adding doc %+v to Bulk Indexer failed: %+v, %+v, %s ", doc, item, res, err))
				},
			},
		)

		if len(failures) > 0 {
			logger.Sugar().Errorf("Failed to index items in Elasticsearch: %+v", failures)
		}

		if err != nil {
			return fmt.Errorf("Could not add doc %+v to bulk: %+v ", doc, err)
		}

	}

	return nil
}
