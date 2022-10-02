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

func (c *documentController) Bulk(ds ...*interactor.Document) []error {
	// TODO get BulkIndexerConfig from pkg/config
	var errs []error

	d_by_idx, err := arrangeDocumentsByIdx(ds)

	if err != nil {
		return append(errs, err)
	}

	for idx, docs := range *d_by_idx {
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

		errs = append(errs, bulk(bi, idx, docs)...)

		errs = append(errs, bi.Close(context.Background()))
	}

	if len(errs) > 0 {
		return errs
	}

	return nil
}

func arrangeDocumentsByIdx(ds []*interactor.Document) (*map[string][]*interactor.Document, error) {
	var d_by_idx map[string][]*interactor.Document

	for _, d := range ds {
		if _, ok := d_by_idx[d.Index]; !ok {
			d_by_idx[d.Index] = []*interactor.Document{}
		}
		d_by_idx[d.Index] = append(d_by_idx[d.Index], d)
	}

	return &d_by_idx, nil
}

func bulk(bi esutil.BulkIndexer, idx string, docs []*interactor.Document) []error {
	var errs []error

	for doc := range docs {
		data, err := json.Marshal(doc)

		if err != nil {
			return append(errs, err)
		}

		err = bi.Add(
			context.Background(),
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
