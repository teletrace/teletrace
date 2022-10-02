package interactor

import (
	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"
)

type ExistsResponse struct {
	Exists bool
}

type IndexTemplate struct {
	Name               string   `default:"lupa_default_spans_index_template"`
	NumberOfShards     int      `default:"1"`
	NumberOfReplicas   int      `default:"1"`
	ILMPolicyName      string   `default:"lupa_default_ilm_policy"`
	ComponentTemplates []string `default:"[\"lupa_default_spans_component_template\"]"`
	IndexPatterns      []string `default:"[\"lupa-spans-*\"]"`
}

type IndexTemplateController interface {
	CreateIndexTemplate(t *IndexTemplate) error
	IndexTemplateExists(name string) (*ExistsResponse, error)
}

type IndexSort struct {
	Order string
	Field string
}

type ComponentTemplate struct {
	Name            string      `default:"lupa_default_spans_component_template"`
	TimestampField  string      `default:"@timestamp"`
	TimestampFormat string      `default:"yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd||yyyy-MM-dd'T'HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSSSS||epoch_millis"`
	IndexSort       []IndexSort `default:"[\"Order\":\"desc\",\"Field\":\"@timestamp\"]"`
	MaxTotalFields  int         `default:"1000"`
}

type ComponentTemplateController interface {
	CreateComponentTemplate(t *ComponentTemplate) error
	ComponentTemplateExists(name string) (*ExistsResponse, error)
}

type ILMPolicy struct {
	Name        string `default:"kupa_default_ilm_policy"`
	Rollover    string `default:"30gb"` // TODO rollover after time
	DeleteAfter string `default:"30d"`
}

type ILMPolicyController interface {
	CreateILMPolicy(p *ILMPolicy) error
	ILMPolicyExists(name string) (*ExistsResponse, error)
}

type DataStream struct {
	Name string
}

type DataStreamController interface {
	DataStreamExists(name string) (*ExistsResponse, error)
	CreateDataStream(d *DataStream) error
}

type Document struct {
	Span  *v1.ExtractedSpan
	Index string
	// ExtractedSpan here?
}

type DocumentController interface {
	Bulk(ds ...*Document) []error
}

type Interactor struct {
	IndexTemplateController     IndexTemplateController
	ComponentTemplateController ComponentTemplateController
	ILMPolicyController         ILMPolicyController
	DocumentController          DocumentController
	IndexController             DataStreamController
}
