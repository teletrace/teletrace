package es

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
	"oss-tracing/pkg/spanformatutil"
)

type spanWriter struct {
	documentController interactor.DocumentController
}

func (w *spanWriter) WriteSpan(ctx context.Context, span *v1.ExtractedSpan) []error {
	var errs []error

	converted_spans, err := spanformatutil.FlattenSpans(span)

	if err != nil {
		return append(errs, err)
	}

	es := w.documentController.Bulk(ctx, converted_spans)

	if len(errs) > 0 {
		errs = append(es)
	}

	return errs
}

func (w *spanWriter) WriteBulk(ctx context.Context, spans ...*v1.ExtractedSpan) []error {
	var errs []error

	converted_spans, e := spanformatutil.FlattenSpans(spans...)

	if e != nil {
		errs = append(errs, e)
	}

	es := w.documentController.Bulk(ctx, converted_spans)

	if len(errs) > 0 {
		errs = append(es)
	}

	return errs
}
