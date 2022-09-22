package es

import (
	"oss-tracing/pkg/esclient"
	"oss-tracing/plugin/storage"

	"go.uber.org/zap"
)

func createSpanWriter(
	logger *zap.Logger,
	client esclient.Client,
) (storage.SpanWriter, error) {
	// This should create a span writer to ES instance
	// and validate proper es settings and configs
	// if settings or configs are not found, sets them.

	var err error

}
