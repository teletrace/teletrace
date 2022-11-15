package es

import (
	"context"
	"fmt"
	spanstorage "oss-tracing/pkg/spanstorage"
	config2 "oss-tracing/plugin/spanstorage/es/config"
	"oss-tracing/plugin/spanstorage/es/factory"
	"oss-tracing/plugin/spanstorage/es/interactor"

	"go.uber.org/zap"
)

type storage struct {
	cfg        interactor.ElasticConfig
	logger     *zap.Logger
	ctx        context.Context
	interactor *interactor.Interactor
}

func NewStorage(ctx context.Context, logger *zap.Logger, cfg interactor.ElasticConfig) (spanstorage.Storage, error) {
	var err error

	esInteractor, err := factory.NewInteractor(logger, cfg)

	if err != nil {
		return nil, fmt.Errorf("Could not create ES interactor: %+v", err)
	}

	return &storage{interactor: esInteractor, ctx: ctx, logger: logger, cfg: cfg}, err
}

func (s *storage) Initialize() error {
	var err error

	forceCreate := s.cfg.ForceCreate

	it, err := config2.NewIndexTemplate(s.cfg.Index)

	if err != nil {
		return fmt.Errorf("Could not generate Index Template %+v", err)
	}

	ct, err := config2.NewComponentTemplate()

	if err != nil {
		return fmt.Errorf("Could not generate Component Template: %+v", err)
	}

	if err = initComponentTemplate(s.ctx, s.logger, s.interactor.ComponentTemplateController, *ct, forceCreate); err != nil {
		return fmt.Errorf("Could not init Component Template: %+v", err)
	}
	if err = initIndexTemplate(s.ctx, s.logger, s.interactor.IndexTemplateController, *it, forceCreate); err != nil {
		return fmt.Errorf("Could not init Index Template: %+v", err)
	}

	return nil

}

func (s *storage) CreateSpanWriter() (spanstorage.SpanWriter, error) {
	// This creates a span writer to ES instance
	// and validates proper es settings and configs.
	// if settings or configs are not found, sets them.

	return &spanWriter{documentController: s.interactor.DocumentController}, nil
}

func (s *storage) CreateSpanReader() (spanstorage.SpanReader, error) {
	return &spanReader{
		documentController: s.interactor.DocumentController,
		tagsController:     s.interactor.TagsController,
	}, nil
}
