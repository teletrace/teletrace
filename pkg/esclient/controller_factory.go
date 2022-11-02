package esclient

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/esclient/rawreqinteractor"
	"oss-tracing/pkg/esclient/typedreqinteractor"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"github.com/elastic/go-elasticsearch/v8/esutil"
)

type documentController struct {
	rawClient   *rawreqinteractor.Client
	typedClient *typedreqinteractor.Client
	idx         string
	bulkIndexer esutil.BulkIndexer
}

func NewDocumentController(rc *rawreqinteractor.Client, tc *typedreqinteractor.Client, idx string, indexerWorkers int, indexerTimeout int) (*documentController, error) {
	bi, err := rawreqinteractor.NewBulkIndexer(*rc, idx, indexerWorkers, indexerTimeout)

	if err != nil {
		return nil, fmt.Errorf("Could not create bulk indexer: %+v", err)
	}

	return &documentController{rawClient: rc, typedClient: tc, idx: idx, bulkIndexer: bi}, nil
}

func NewIndexTemplateController(_ *rawreqinteractor.Client, tc *typedreqinteractor.Client) interactor.IndexTemplateController {
	return typedreqinteractor.NewIndexTemplateController(tc)
}

func NewComponentTemplateController(_ *rawreqinteractor.Client, tc *typedreqinteractor.Client) interactor.ComponentTemplateController {
	return typedreqinteractor.NewComponentTemplateController(tc)
}

func NewTagsController(rc *rawreqinteractor.Client, _ *typedreqinteractor.Client, idx string) interactor.TagsController {
	return rawreqinteractor.NewTagsController(rc, idx)
}

func (c *documentController) WriteBulk(ctx context.Context, docs ...*interactor.Doc) error {
	return rawreqinteractor.WriteBulk(ctx, *c.rawClient, c.bulkIndexer, docs...)
}

func (c *documentController) Close(ctx context.Context) error {
	return rawreqinteractor.Close(ctx, *c.rawClient, c.bulkIndexer)
}

func (c *documentController) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return typedreqinteractor.Search(ctx, *c.typedClient, c.idx, r)
}
