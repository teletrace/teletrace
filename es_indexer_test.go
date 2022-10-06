package main

import (
	"context"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/spanformatutil/spanformatutiltests"
	"oss-tracing/plugin/spanstorage/es"
	"testing"

	"go.uber.org/zap"
)

// TODO Test the ES SpanWriter locally
// run elasticsearch docker locally
func TestMain(t *testing.T) {
	logger, err := zap.NewDevelopment()
	if err != nil {
		t.Fatal(err)
	}

	cfg, err := config.NewConfig()
	if err != nil {
		t.Fatal(err)
	}

	sw, err := es.NewSpanWriter(context.Background(), logger, cfg)
	if err != nil {
		t.Fatal(err)
	}

	attrs := map[string]any{"intValue": 1, "stringValue": "str"}
	span := spanformatutiltests.GenExtractedSpan(attrs, attrs, attrs)

	sw.WriteBulk(context.Background(), span)
}
