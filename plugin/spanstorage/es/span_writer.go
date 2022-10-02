package es

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
)

type spanWriter struct {
	documentController interactor.DocumentController
}

func (w *spanWriter) WriteSpan(ctx context.Context, span *v1.ExtractedSpan) error {

}

func (w *spanWriter) WriteBulk(ctx context.Context, spans ...*v1.ExtractedSpan) []error {
	var errs []error

	exploded_spans, err := spanexploder.Explode(spans)

	if err != nil {
		errs = append(errs, err)
	}

	errs = w.documentController.Bulk()
}
