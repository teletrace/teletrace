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

	itc := NewIndexTemplateController(rawApiClient, typedApiClient)

	ctc := NewComponentTemplateController(rawApiClient, typedApiClient)

	dc, err := NewDocumentController(rawApiClient, typedApiClient, cfg.Index, cfg.IndexerWorkers, cfg.IndexerTimeout)
	if err != nil {
		return nil, fmt.Errorf("failed to create a Document Controller: %v", err)
	}

	tc := NewTagsController(rawApiClient, typedApiClient, cfg.Index)

	return &interactor.Interactor{
		IndexTemplateController:     itc,
		ComponentTemplateController: ctc,
		DocumentController:          dc,
		TagsController:              tc,
	}, nil
}
