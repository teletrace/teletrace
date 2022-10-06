package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient"
	esconfig "oss-tracing/pkg/esclient/config"
	"oss-tracing/pkg/esclient/interactor"
	storage "oss-tracing/pkg/spanstorage"

	"go.uber.org/zap"
)

func NewSpanWriter(
	ctx context.Context,
	logger *zap.Logger,
	cfg config.Config,
) (storage.SpanWriter, error) {
	// This should create a span writer to ES instance
	// and validate proper es settings and configs
	// if settings or configs are not found, sets them.

	var err error

	es_interactor, err := esclient.NewInteractor(logger, cfg)

	if err != nil {
		return nil, fmt.Errorf("Could not create ES interactor: %+v", err)
	}

	force_create := cfg.ESForceCreateConfig

	if err = initILMPolicy(ctx, logger, es_interactor.ILMPolicyController, cfg, force_create); err != nil {
		return nil, fmt.Errorf("Could not init ILM Policy: %+v", err)
	}
	if err = initIndexTemplate(ctx, logger, es_interactor.IndexTemplateController, cfg, force_create); err != nil {
		return nil, fmt.Errorf("Could not init Index Template: %+v", err)
	}
	if err = initComponentTemplate(ctx, logger, es_interactor.ComponentTemplateController, cfg, force_create); err != nil {
		return nil, fmt.Errorf("Could not init Component Template: %+v", err)
	}

	return &spanWriter{documentController: es_interactor.DocumentController}, nil
}

func initILMPolicy(ctx context.Context, logger *zap.Logger, ctrl interactor.ILMPolicyController, cfg config.Config, force_create bool) error {
	var err error

	ilmPolicy, err := esconfig.NewILMPolicy(cfg)

	if err != nil {
		return err
	}

	policy_exists, err := ctrl.ILMPolicyExists(ctx, ilmPolicy.Name)

	if err != nil {
		return fmt.Errorf("Could not check if ILM policy exists: %+v", err)
	}

	if !policy_exists.Exists || force_create {
		err = ctrl.CreateILMPolicy(ctx, ilmPolicy)

		if err != nil {
			return fmt.Errorf("Could not create ILM policy: %+v", err)
		}
	}

	return nil
}

func initIndexTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.IndexTemplateController, cfg config.Config, force_create bool) error {
	var err error

	indexTemplate, err := esconfig.NewIndexTemplate(cfg)

	if err != nil {
		return err
	}

	template_exists, err := ctrl.IndexTemplateExists(ctx, indexTemplate.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize index template %+v", err)
	}

	if !template_exists.Exists || force_create {
		err = ctrl.CreateIndexTemplate(ctx, indexTemplate)

		if err != nil {
			return err
		}
	}

	return nil
}

func initComponentTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.ComponentTemplateController, cfg config.Config, force_create bool) error {
	var err error

	componentTemplate, err := esconfig.NewComponentTemplate(cfg)

	if err != nil {
		return fmt.Errorf("Could not create new component template from config: %+v", err)
	}

	template_exists, err := ctrl.ComponentTemplateExists(ctx, componentTemplate.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize component template %+v", err)
	}

	if !template_exists.Exists || force_create {
		err = ctrl.CreateComponentTemplate(ctx, componentTemplate)

		if err != nil {
			return fmt.Errorf("Could not create component template: %+v", err)
		}
	}

	return nil
}
