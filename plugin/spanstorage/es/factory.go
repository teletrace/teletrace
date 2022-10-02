package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient"
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
		return nil, err
	}

	force_create := cfg.ESForceCreateConfig

	if err = initILMPolicy(ctx, logger, es_interactor.ILMPolicyController, cfg, force_create); err != nil {
		return nil, err
	}
	if err = initIndexTemplate(ctx, logger, es_interactor.IndexTemplateController, cfg, force_create); err != nil {
		return nil, err
	}
	if err = initComponentTemplate(ctx, logger, es_interactor.ComponentTemplateController, cfg, force_create); err != nil {
		return nil, err
	}

	return &spanWriter{documentController: es_interactor.DocumentController}, nil
}

func initILMPolicy(ctx context.Context, logger *zap.Logger, ctrl interactor.ILMPolicyController, cfg config.Config, force_create bool) error {
	var err error

	ilmPolicy, err := esclient.NewILMPolicy(cfg)

	if err != nil {
		return err
	}

	policy_exists, err := ctrl.ILMPolicyExists(ctx, ilmPolicy.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize ILM policy %+v", err)
	}

	if !policy_exists.Exists || force_create {
		ctrl.CreateILMPolicy(ctx, ilmPolicy)
	}

	return nil
}

func initIndexTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.IndexTemplateController, cfg config.Config, force_create bool) error {
	var err error

	indexTemplate, err := esclient.NewIndexTemplate(cfg)

	if err != nil {
		return err
	}

	template_exists, err := ctrl.IndexTemplateExists(ctx, indexTemplate.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize index template %+v", err)
	}

	if !template_exists.Exists || force_create {
		ctrl.CreateIndexTemplate(ctx, indexTemplate)
	}

	return nil
}

func initComponentTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.ComponentTemplateController, cfg config.Config, force_create bool) error {
	var err error

	componentTemplate, err := esclient.NewComponentTemplate(cfg)

	if err != nil {
		return err
	}

	template_exists, err := ctrl.ComponentTemplateExists(ctx, componentTemplate.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize component template %+v", err)
	}

	if !template_exists.Exists || force_create {
		ctrl.CreateComponentTemplate(componentTemplate)
	}

	return nil
}
