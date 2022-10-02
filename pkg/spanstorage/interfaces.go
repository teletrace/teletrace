package storage

import (
	"context"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
)

type SpanWriter interface {
	WriteSpan(ctx context.Context, span *v1.ExtractedSpan) []error
	WriteBulk(ctx context.Context, spans ...*v1.ExtractedSpan) []error
}
