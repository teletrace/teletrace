package es

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"
	v1 "oss-tracing/pkg/model/extracted_span/v1"
)

type spanWriter struct {
	documentController interactor.DocumentController
}

func (w *spanWriter) WriteSpan(ctx context.Context, span *v1.ExtractedSpan) []error {
	var errs []error

	es := w.documentController.Bulk(ctx, []*v1.ExtractedSpan{span})

	if len(errs) > 0 {
		errs = append(es)
	}

	return errs
}

func (w *spanWriter) WriteBulk(ctx context.Context, spans ...*v1.ExtractedSpan) []error {
	var errs []error

	es := w.documentController.Bulk(ctx, spans)

	if len(es) > 0 {
		errs = append(es)
	}

	return errs
}
