package esclient

import (
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"
	rawreqinteractor "oss-tracing/pkg/esclient/raw_req_interactor"
	typedreqinteractor "oss-tracing/pkg/esclient/typed_req_interactor"

	"go.uber.org/zap"
)

func NewInteractor(logger *zap.Logger, cfg config.Config) (*interactor.Interactor, error) {
	var err error

	typed_api_client, err := typedreqinteractor.NewClient(cfg, logger)
	raw_api_client, err := rawreqinteractor.NewClient(cfg, logger)

	if err != nil {
		return nil, err
	}

	//TODO allow choosing which api to use
	index_template_controller := typedreqinteractor.NewIndexTemplateController(typed_api_client, cfg)
	component_template_controller := typedreqinteractor.NewComponentTemplateController(typed_api_client, cfg)
	document_controller := rawreqinteractor.NewDocumentController(raw_api_client, cfg)

	return &interactor.Interactor{
		IndexTemplateController:     index_template_controller,
		ComponentTemplateController: component_template_controller,
		DocumentController:          document_controller,
	}, nil
}
