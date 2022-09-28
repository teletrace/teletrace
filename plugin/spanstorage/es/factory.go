package es

import (
	"fmt"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient"
	"oss-tracing/pkg/esclient/interactor"
	storage "oss-tracing/pkg/spanstorage"

	"go.uber.org/zap"
)

func NewSpanWriter(
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

	if err = initILMPolicy(logger, es_interactor.ILMPolicyController); err != nil {
		return nil, err
	}
	if err = initIndexTemplate(logger, es_interactor.IndexTemplateController); err != nil {
		return nil, err
	}
	if err = initComponentTemplate(logger, es_interactor.ComponentTemplateController); err != nil {
		return nil, err
	}

	return spanWriter{}, nil
}

func initILMPolicy(logger *zap.Logger, ctrl interactor.ILMPolicyController) error {
	var err error

	ilmPolicyName := "temp"

	policy_exists, err := ctrl.ILMPolicyExists(ilmPolicyName)

	if err != nil {
		return fmt.Errorf("Could not initialize ILM policy %+v", err)
	}

	if !policy_exists.Exists {
		// TODO generate policy from config

		ilmPolicy := interactor.ILMPolicy{}

		ctrl.CreateILMPolicy(&ilmPolicy)
	}

	return nil
}

func initIndexTemplate(logger *zap.Logger, ctrl interactor.IndexTemplateController) error {
	var err error

	indexTemplateName := "temp"

	template_exists, err := ctrl.IndexTemplateExists(indexTemplateName)

	if err != nil {
		fmt.Errorf("Could not initialize index template %+v", err)
	}

	if !template_exists.Exists {
		// TODO generate policy from config

		indexTemplate := interactor.IndexTemplate{}

		ctrl.CreateIndexTemplate(&indexTemplate)
	}

	return nil
}

func initComponentTemplate(logger *zap.Logger, ctrl interactor.ComponentTemplateController) error {
	var err error

	componentTemplate := "temp" // TODO Generate the various configs names

	template_exists, err := ctrl.ComponentTemplateExists(componentTemplate)

	if err != nil {
		fmt.Errorf("Could not initialize component template %+v", err)
	}

	if !template_exists.Exists {
		// TODO generate policy from config

		componentTemplate := interactor.ComponentTemplate{}

		ctrl.CreateComponentTemplate(&componentTemplate)
	}

	return nil
}
