package esclient

import (
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	"oss-tracing/pkg/esclient/rawreqinteractor"
	"oss-tracing/pkg/esclient/typedreqinteractor"

	"go.uber.org/zap"
)

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
	documentController := rawreqinteractor.NewDocumentController(rawApiClient, cfg.Index)
	tagsController := rawreqinteractor.NewTagsController(rawApiClient, cfg.Index)

	return &interactor.Interactor{
		IndexTemplateController:     indexTemplateController,
		ComponentTemplateController: componentTemplateController,
		DocumentController:          documentController,
		TagsController:              tagsController,
	}, nil
}
