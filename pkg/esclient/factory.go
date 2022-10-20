package esclient

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/esclient/rawreqinteractor"
	"oss-tracing/pkg/esclient/typedreqinteractor"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	"go.uber.org/zap"
)

type documentController struct {
	rawClient   rawreqinteractor.Client
	typedClient typedreqinteractor.Client
	idx         string
}

func NewInteractor(logger *zap.Logger, cfg interactor.ElasticConfig) (*interactor.Interactor, error) {
	var err error

	typedApiClient, err := typedreqinteractor.NewClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create a typed client: %v", err)
	}

	rawApiClient, err := rawreqinteractor.NewClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create a raw client: %v", err)
	}

	//TODO allow choosing which api to use
	indexTemplateController := typedreqinteractor.NewIndexTemplateController(typedApiClient)
	componentTemplateController := typedreqinteractor.NewComponentTemplateController(typedApiClient)
	dc := NewDocumentController(*rawApiClient, *typedApiClient, cfg.Index)
	tagsController := rawreqinteractor.NewTagsController(rawApiClient, cfg.Index)

	return &interactor.Interactor{
		IndexTemplateController:     indexTemplateController,
		ComponentTemplateController: componentTemplateController,
		DocumentController:          dc,
		TagsController:              tagsController,
	}, nil
}

func NewDocumentController(rc rawreqinteractor.Client, tc typedreqinteractor.Client, idx string) *documentController {
	return &documentController{rawClient: rc, typedClient: tc, idx: idx}
}

func (c *documentController) Bulk(ctx context.Context, docs ...*interactor.Doc) error {
	return rawreqinteractor.Bulk(ctx, c.rawClient, c.idx, docs...)
}

func (c *documentController) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	return typedreqinteractor.Search(ctx, c.typedClient, c.idx, r)
}
