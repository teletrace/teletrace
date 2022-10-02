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
	ilm_controller := rawreqinteractor.NewILMPolicyController(*raw_api_client)
	index_template_controller := typedreqinteractor.NewIndexTemplateController(*typed_api_client)
	component_template_controller := typedreqinteractor.NewComponentTemplateController(*typed_api_client)
	index_controller := typedreqinteractor.NewIndexController(*typed_api_client)
	document_controller := typedreqinteractor

	return &interactor.Interactor{
		ILMPolicyController:         ilm_controller,
		IndexTemplateController:     index_template_controller,
		ComponentTemplateController: component_template_controller,
		IndexController:             index_controller,
	}, nil
}
