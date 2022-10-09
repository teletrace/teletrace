package interactor

import (
	"context"
	v1 "oss-tracing/pkg/model/extracted_span/v1"
)

type ExistsResponse struct {
	Exists bool
}

type IndexTemplate struct {
	Name               string   `default:"lupa_default_spans_index_template"`
	NumberOfShards     int      `default:"1"`
	NumberOfReplicas   int      `default:"1"`
	ComponentTemplates []string `default:"[\"lupa_default_spans_component_template\"]"`
	IndexPatterns      []string `default:"[\"lupa-spans\"]"`
}

type IndexTemplateController interface {
	CreateIndexTemplate(ctx context.Context, t *IndexTemplate) error
	IndexTemplateExists(ctx context.Context, name string) (*ExistsResponse, error)
}

type IndexSort struct {
	Order string
	Field string
}

type ComponentTemplate struct {
	Name            string      `default:"lupa_default_spans_component_template"`
	TimestampField  string      `default:"@timestamp"`
	TimestampFormat string      `default:"yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd||yyyy-MM-dd'T'HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSSSS||epoch_millis"`
	IndexSort       []IndexSort `default:"[{\"Order\":\"desc\",\"Field\":\"@timestamp\"}]"`
	MaxTotalFields  int         `default:"1000"`
}

type ComponentTemplateController interface {
	CreateComponentTemplate(ctx context.Context, t *ComponentTemplate) error
	ComponentTemplateExists(ctx context.Context, name string) (*ExistsResponse, error)
}

type DocumentController interface {
	Bulk(ctx context.Context, docs []*v1.ExtractedSpan) []error
}

type Interactor struct {
	IndexTemplateController     IndexTemplateController
	ComponentTemplateController ComponentTemplateController
	DocumentController          DocumentController
}
