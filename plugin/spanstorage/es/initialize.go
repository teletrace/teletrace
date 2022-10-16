package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"

	"go.uber.org/zap"
)

func initIndexTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.IndexTemplateController, it interactor.IndexTemplate, forceCreate bool) error {
	var err error

	templateExists, err := ctrl.IndexTemplateExists(ctx, it.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize index template %+v", err)
	}

	if !templateExists.Exists || forceCreate {
		err = ctrl.CreateIndexTemplate(ctx, it)

		if err != nil {
			return err
		}
	}

	return nil
}

func initComponentTemplate(ctx context.Context, logger *zap.Logger, ctrl interactor.ComponentTemplateController, ct interactor.ComponentTemplate, forceCreate bool) error {
	var err error

	templateExists, err := ctrl.ComponentTemplateExists(ctx, ct.Name)

	if err != nil {
		return fmt.Errorf("Could not initialize component template %+v", err)
	}

	if !templateExists.Exists || forceCreate {
		err = ctrl.CreateComponentTemplate(ctx, ct)

		if err != nil {
			return fmt.Errorf("Could not create component template: %+v", err)
		}
	}

	return nil
}
