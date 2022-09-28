package storage

import (
	"context"
	"oss-tracing/pkg/esclient"
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
)

type SpanWriter interface {
	WriteSpan(ctx context.Context, span *v1.ExtractedSpan) error
}

type spanWriter struct {
	index_template_controller     esclient.IndexTemplateController
	component_template_controller esclient.ComponentTemplateController
}

type spanWriterParams struct {
	logger string // TODO
}
