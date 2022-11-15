package interactor

import (
	"context"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
)

type Doc any

type ElasticConfig struct {
	Endpoint       string
	Username       string
	Password       string
	ApiKey         string
	ServiceToken   string
	ForceCreate    bool
	Index          string
	IndexerWorkers int
	IndexerTimeout int
}

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

type IndexTemplateController interface {
	CreateIndexTemplate(ctx context.Context, t IndexTemplate) error
	IndexTemplateExists(ctx context.Context, name string) (*ExistsResponse, error)
}

type ComponentTemplateController interface {
	CreateComponentTemplate(ctx context.Context, t ComponentTemplate) error
	ComponentTemplateExists(ctx context.Context, name string) (*ExistsResponse, error)
}

type DocumentController interface {
	WriteBulk(ctx context.Context, docs ...*Doc) error
	Close(ctx context.Context) error
	Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error)
}

type TagsController interface {
	// Get all available tags
	GetAvailableTags(ctx context.Context, request tagsquery.GetAvailableTagsRequest) (tagsquery.GetAvailableTagsResponse, error)

	// Get the values and appearance count of all tags as specified by request.Tags
	GetTagsValues(ctx context.Context, request tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error)
}

type Interactor struct {
	ElasticConfig               ElasticConfig
	IndexTemplateController     IndexTemplateController
	ComponentTemplateController ComponentTemplateController
	DocumentController          DocumentController
	TagsController              TagsController
}
