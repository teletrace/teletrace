package rawreqinteractor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/config"
	esconfig "oss-tracing/pkg/esclient/config"
	"oss-tracing/pkg/esclient/interactor"
	"time"

	"github.com/elastic/go-elasticsearch/v8/esutil"
)

type documentController struct {
	client Client
	cfg    config.Config
}

func NewDocumentController(client Client, cfg config.Config) interactor.DocumentController {
	return &documentController{client: client, cfg: cfg}
}

func (c *documentController) Bulk(ctx context.Context, docs []*map[string]any) []error {
	// TODO get BulkIndexerConfig from pkg/config
	var errs []error

	idx := esconfig.GenIndexName(c.cfg)

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         idx,              // The default index name
		Client:        &c.client.Client, // The Elasticsearch client
		NumWorkers:    1,                // The number of worker goroutines
		FlushInterval: 30 * time.Second, // The periodic flush interval
	})

	if err != nil {
		return append(errs, fmt.Errorf("Error creating the indexer: %s", err))
	}

	_errs := bulk(ctx, bi, idx, docs)

	if len(_errs) > 0 {
		errs = append(errs, _errs...)
	}

	err = bi.Close(context.Background())

	if err != nil {
		errs = append(errs, fmt.Errorf("Could not close the Bulk Indexer: %+v", err))
	}

	if len(errs) > 0 {
		return errs
	}

	return nil
}

func bulk(ctx context.Context, bi esutil.BulkIndexer, idx string, docs []*map[string]any) []error {
	var errs []error

	for _, doc := range docs {
		data, err := json.Marshal(doc)

		if err != nil {
			return append(errs, fmt.Errorf("Could not json marshal doc %s: %+v", doc, err))
		}

		err = bi.Add(
			ctx,
			esutil.BulkIndexerItem{
				Action: "create",
				Body:   bytes.NewReader(data),
				OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
					errs = append(errs, fmt.Errorf("Adding doc %s to Bulk Indexer failed: %+v, %+v, %s ", doc, item, res, err))
				},
			},
		)

		if err != nil {
			return append(errs, fmt.Errorf("Could not add doc %s to bulk: %+v ", doc, err))
		}
	}

	if len(errs) > 0 {
		return errs
	}

	return nil
}
