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

	itc, err := NewIndexTemplateController(rawApiClient, typedApiClient)
	if err != nil {
		return nil, fmt.Errorf("failed to create an Index Template Controller: %v", err)
	}

	ctc, err := NewComponentTemplateController(rawApiClient, typedApiClient)
	if err != nil {
		return nil, fmt.Errorf("failed to create a Component Template Controller: %v", err)
	}

	dc, err := NewDocumentController(rawApiClient, typedApiClient, cfg.Index)
	if err != nil {
		return nil, fmt.Errorf("failed to create a Document Controller: %v", err)
	}

	tc, err := NewTagsController(rawApiClient, typedApiClient, cfg.Index)
	if err != nil {
		return nil, fmt.Errorf("failed to create a Tags Controller: %v", err)
	}

	return &interactor.Interactor{
		IndexTemplateController:     itc,
		ComponentTemplateController: ctc,
		DocumentController:          dc,
		TagsController:              tc,
	}, nil
}
