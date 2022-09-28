package interactor

type ExistsResponse struct {
	Exists bool
}

type IndexTemplate struct {
	Name             string `default:"lupa_default_spans_index_template"`
	NumberOfShards   int    `default:"1"`
	NumberOfReplicas int    `default:"1"`
	ILMPolicyName    string `default:"lupa_default_ilm_policy"`
}

type IndexTemplateController interface {
	CreateIndexTemplate(t *IndexTemplate) error
	IndexTemplateExists(name string) (*ExistsResponse, error)
}

type indexSort struct {
	order string
	field string
}

type ComponentTemplate struct {
	Name            string      `default:"lupa_default_spans_component_template"`
	TimestampField  string      `default:"@timestamp"`
	TimestampFormat string      `default:"yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd||yyyy-MM-dd'T'HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSSSS||epoch_millis"`
	IndexSort       []indexSort `default:"[\"order\":\"desc\",\"field\":\"@timestamp\"]"`
	MaxTotalFields  int         `default:"1000"`
}

type ComponentTemplateController interface {
	CreateComponentTemplate(t *ComponentTemplate) error
	ComponentTemplateExists(name string) (*ExistsResponse, error)
}

type ILMPolicy struct {
	Name string
}

type ILMPolicyController interface {
	CreateILMPolicy(p *ILMPolicy) error
	ILMPolicyExists(name string) (*ExistsResponse, error)
}

type Index struct {
	isDataStream bool
}

type IndexController interface {
	CreateIndex(*Index)
	CreateDataStream(*Index)
}

type Document struct {
	// ExtractedSpan here?
}

type DocumentController interface {
	CreateDocument(*Document)
}

type Interactor struct {
	IndexTemplateController     IndexTemplateController
	ComponentTemplateController ComponentTemplateController
	ILMPolicyController         ILMPolicyController
	DocumentController          DocumentController
	IndexController             IndexController
}
