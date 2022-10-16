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
	client *Client
	idx    string
}

func NewDocumentController(client *Client, idx string) interactor.DocumentController {
	return &documentController{client: client, idx: idx}
}

func (c *documentController) Bulk(ctx context.Context, docs ...*interactor.Doc) []error {
	var errs []error

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         c.idx,
		Client:        c.client.Client,
		NumWorkers:    1,
		FlushInterval: 30 * time.Second,
	})

	if err != nil {
		return append(errs, fmt.Errorf("Error creating the indexer: %s", err))
	}

	_errs := bulk(ctx, bi, c.idx, docs...)

	if len(_errs) > 0 {
		errs = append(errs, _errs...)
	}

	err = bi.Close(context.Background())

	if err != nil {
		errs = append(errs, fmt.Errorf("Could not close the Bulk Indexer: %+v", err))
	}

	biStats := bi.Stats()
	c.client.Logger.Sugar().Debugf("BiStats: %+v", biStats)

	if len(errs) > 0 {
		return errs
	}

	return nil
}

func bulk(ctx context.Context, bi esutil.BulkIndexer, idx string, docs ...*interactor.Doc) []error {
	var errs []error

	for _, doc := range docs {
		data, err := json.Marshal(&doc)

		if err != nil {
			return append(errs, fmt.Errorf("Could not json marshal doc %+v: %+v", doc, err))
		}

		err = bi.Add(
			ctx,
			esutil.BulkIndexerItem{
				Action: "create",
				Body:   bytes.NewReader(data),
				OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
					errs = append(errs, fmt.Errorf("Adding doc %+v to Bulk Indexer failed: %+v, %+v, %s ", doc, item, res, err))
				},
			},
		)

		if err != nil {
			return append(errs, fmt.Errorf("Could not add doc %+v to bulk: %+v ", doc, err))
		}
	}

	if len(errs) > 0 {
		return errs
	}

	return nil
}
