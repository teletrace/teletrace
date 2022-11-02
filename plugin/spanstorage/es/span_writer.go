package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	v1 "oss-tracing/pkg/model/internalspan/v1"
)

type spanWriter struct {
	documentController interactor.DocumentController
}

func (w *spanWriter) WriteSpan(ctx context.Context, span *v1.InternalSpan) error {
	var err error

	doc := interactor.Doc(span)

	err = w.documentController.AddToBulk(ctx, &doc)

	if err != nil {
		return fmt.Errorf("Could not index document: %+v", err)
	}

	err = w.documentController.FlushBulk(ctx)

	if err != nil {
		return fmt.Errorf("Could not bulk index documents: %+v", err)
	}

	return nil
}

func (w *spanWriter) AddToBulk(ctx context.Context, spans ...*v1.InternalSpan) error {
	var err error

	docs := make([]*interactor.Doc, 0, len(spans))

	for _, span := range spans {
		doc := interactor.Doc(span)
		docs = append(docs, &doc)
	}

	err = w.documentController.AddToBulk(ctx, docs...)

	if err != nil {
		return fmt.Errorf("Could not bulk index documents: %+v", err)
	}

	return nil
}

func (w *spanWriter) FlushBulk(ctx context.Context) error {
	var err error

	err = w.documentController.FlushBulk(ctx)

	if err != nil {
		return fmt.Errorf("Could not flush documents bulk %+v", err)
	}

	return nil
}
