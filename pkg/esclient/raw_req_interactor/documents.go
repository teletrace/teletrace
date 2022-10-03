package rawreqinteractor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"time"

	"github.com/elastic/go-elasticsearch/v8/esutil"
)

type documentController struct {
	client Client
}

func NewDocumentController(client Client) interactor.DocumentController {
	return &documentController{client: client}
}

func (c *documentController) Bulk(ctx context.Context, docs []*map[string]any) []error {
	// TODO get BulkIndexerConfig from pkg/config
	var errs []error

	idx := "lupa-spans"

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         idx,              // The default index name
		Client:        &c.client.Client, // The Elasticsearch client
		NumWorkers:    1,                // The number of worker goroutines
		FlushBytes:    int(5e+6),        // The flush threshold in bytes
		FlushInterval: 30 * time.Second, // The periodic flush interval
	})

	if err != nil {
		return append(errs, fmt.Errorf("Error creating the indexer: %s", err))
	}

	errs = append(errs, bulk(ctx, bi, idx, docs)...)

	errs = append(errs, bi.Close(ctx))

	if len(errs) > 0 {
		return errs
	}

	return nil
}

func bulk(ctx context.Context, bi esutil.BulkIndexer, idx string, docs []*map[string]any) []error {
	var errs []error

	for doc := range docs {
		data, err := json.Marshal(doc)

		if err != nil {
			return append(errs, err)
		}

		err = bi.Add(
			ctx,
			esutil.BulkIndexerItem{
				Action: "index",
				Body:   bytes.NewReader(data),
				OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
					errs = append(errs, err)
				},
			},
		)

		if err != nil {
			return append(errs, err)
		}
	}

	return nil
}
