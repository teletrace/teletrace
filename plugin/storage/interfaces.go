package storage

import (
	"context"
	"oss-tracing/pkg/esclient"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
)

type SpanWriter interface {
	WriteSpan(ctx context.Context, span *v1.ExtractedSpan) error
}

type SpanWriterParams struct {
	client esclient.Client
	logger string // TODO
}

func newSpanWriter() {

}
