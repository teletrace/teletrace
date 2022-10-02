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

	exploded_spans, e := spanformatutil.ExplodeSpans(span)

	if e != nil {
		errs = append(errs, e)
	}

	es := w.documentController.Bulk(exploded_spans)

	if len(errs) > 0 {
		errs = append(es)
	}

	return errs
}

func (w *spanWriter) WriteBulk(ctx context.Context, spans ...*v1.ExtractedSpan) []error {
	var errs []error

	exploded_spans, e := spanformatutil.ExplodeSpans(spans...)

	if e != nil {
		errs = append(errs, e)
	}

	es := w.documentController.Bulk(exploded_spans)

	if len(errs) > 0 {
		errs = append(es)
	}

	return errs
}
