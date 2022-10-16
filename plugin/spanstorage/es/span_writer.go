package es

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"
	v1 "oss-tracing/pkg/model/internalspan/v1"
)

type spanWriter struct {
	documentController interactor.DocumentController
}

func (w *spanWriter) WriteSpan(ctx context.Context, span *v1.InternalSpan) []error {
	var errs []error

	doc := interactor.Doc(span)

	es := w.documentController.Bulk(ctx, &doc)

	if len(errs) > 0 {
		errs = append(errs, es...)
	}

	return errs
}

func (w *spanWriter) WriteBulk(ctx context.Context, spans ...*v1.InternalSpan) []error {
	var errs []error

	var docs []*interactor.Doc

	for _, span := range spans {
		doc := interactor.Doc(span)
		docs = append(docs, &doc)
	}

	es := w.documentController.Bulk(ctx, docs...)

	if len(es) > 0 {
		errs = append(errs, es...)
	}

	return errs
}
