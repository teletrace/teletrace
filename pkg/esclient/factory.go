package esclient

import (
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	rawreqinteractor "oss-tracing/pkg/esclient/raw_req_interactor"
	typedreqinteractor "oss-tracing/pkg/esclient/typed_req_interactor"

	"go.uber.org/zap"
)

func NewInteractor(logger *zap.Logger, cfg interactor.ElasticConfig) (*interactor.Interactor, error) {
	var err error

	typed_api_client, err := typedreqinteractor.NewClient(logger, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create a typed client: %v", err)
	}

	raw_api_client, err := rawreqinteractor.NewClient(cfg, logger)
	if err != nil {
		return nil, fmt.Errorf("failed to create a raw client: %v", err)
	}

	//TODO allow choosing which api to use
	index_template_controller := typedreqinteractor.NewIndexTemplateController(typed_api_client, cfg)
	component_template_controller := typedreqinteractor.NewComponentTemplateController(typed_api_client, cfg)
	document_controller := rawreqinteractor.NewDocumentController(raw_api_client, cfg)
	tags_controller := rawreqinteractor.NewTagsController(raw_api_client, cfg)

	return &interactor.Interactor{
		IndexTemplateController:     index_template_controller,
		ComponentTemplateController: component_template_controller,
		DocumentController:          document_controller,
		TagsController:              tags_controller,
	}, nil
}
