package storage

import (
	"context"
	v1 "oss-tracing/pkg/model/internalspan/v1"
)

type Storage interface {
	Initialize() error
	CreateSpanWriter() (SpanWriter, error)
}

type SpanWriter interface {
	WriteSpan(ctx context.Context, span *v1.InternalSpan) error
	WriteBulk(ctx context.Context, spans ...*v1.InternalSpan) error
}
