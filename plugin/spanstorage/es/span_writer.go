package es

import (
	"context"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
	. "oss-tracing/pkg/spanstorage"
)

type spanWriter struct {
	docume
}

func (w spanWriter) WriteSpan(ctx context.Context, span *v1.ExtractedSpan) error {

}
