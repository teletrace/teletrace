package esclient

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/esclient/rawreqinteractor"
	"oss-tracing/pkg/esclient/typedreqinteractor"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type documentController struct {
	rawClient   *rawreqinteractor.Client
	typedClient *typedreqinteractor.Client
	idx         string
}

func NewDocumentController(rc *rawreqinteractor.Client, tc *typedreqinteractor.Client, idx string) *documentController {
	return &documentController{rawClient: rc, typedClient: tc, idx: idx}
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

func (c *documentController) Bulk(ctx context.Context, docs ...*interactor.Doc) error {
	return rawreqinteractor.Bulk(ctx, *c.rawClient, c.idx, docs...)
}

func (c *documentController) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return typedreqinteractor.Search(ctx, *c.typedClient, c.idx, r)
}
