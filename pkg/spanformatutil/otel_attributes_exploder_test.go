package spanformatutil

import (
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
	"oss-tracing/pkg/spanformatutil/spanformatutiltests"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSpanFormatUtil_FlattenSpans(t *testing.T) {
	var extracted_spans []*v1.ExtractedSpan

	attrs := map[string]any{"intValue": 5, "stringValue": "str", "boolValue": true, "floatValue": 1.23}

	extracted_spans = append(extracted_spans, spanformatutiltests.GenExtractedSpan(attrs, attrs, attrs))

	spans, err := FlattenSpans(extracted_spans...)

	if err != nil {
		t.Fatalf("Could not flatten spans %+v", err)
	}

	assert.Equal(t, len(spans), 1)

	span := *spans[0]

	for _, attr := range []string{"Span", "Resource", "Scope"} {
		if a, ok := span[attr].(map[string]any); !ok {
			t.Fatalf("span does not contain %s as map[string]any", attr)
		} else if _, ok := a["Attributes"].(map[string]any); !ok {
			t.Fatalf("span does not contain %s attributes as map[string]any", attr)
		} else {
			t.Logf("%s attributes are: %v", attr, a["Attributes"])
			assert.Equal(t, len(a["Attributes"].(map[string]any)), len(attrs))
		}
	}
}
