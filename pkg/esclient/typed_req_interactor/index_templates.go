package typedreqinteractor

import (
	"context"
	"fmt"
	"net/http/httputil"
	"strconv"

	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/indices/putindextemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"go.uber.org/zap"
)

type indexTemplateController struct {
	client Client
	cfg    config.Config
}

func NewIndexTemplateController(client Client, cfg config.Config) interactor.IndexTemplateController {
	return &indexTemplateController{client: client, cfg: cfg}
}

func (c *indexTemplateController) IndexTemplateExists(ctx context.Context, name string) (*interactor.ExistsResponse, error) {
	var err error
	exists, err := c.client.Client.API.Indices.ExistsIndexTemplate(name).IsSuccess(ctx)
	if err != nil {
		return nil, err
	}
	return &interactor.ExistsResponse{Exists: exists}, nil

}

func (c *indexTemplateController) CreateIndexTemplate(ctx context.Context, t *interactor.IndexTemplate) error {
	var err error

	template := putindextemplate.NewRequestBuilder().
		IndexPatterns(types.NewIndicesBuilder().Indices(getIndexPatterns(t))).
		ComposedOf(getComposedOf(t)...).
		Template(types.NewIndexTemplateMappingBuilder().
			Settings(types.NewIndexSettingsBuilder().
				NumberOfShards(strconv.Itoa(t.NumberOfShards)).
				NumberOfReplicas(strconv.Itoa(t.NumberOfReplicas)),
			),
		).Build()

	res, err := c.client.Client.API.Indices.PutIndexTemplate(t.Name).Request(template).Do(ctx)

	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 400 {
		return nil
	} else {
		respDump, err := httputil.DumpResponse(res, true)
		if err != nil {
			c.client.Logger.Fatal("Could not dump response: %+v ", zap.Error(err))
		}

		return fmt.Errorf("Could not create index template: %s, status code %d", string(respDump), res.StatusCode)
	}

}

func getIndexPatterns(t *interactor.IndexTemplate) []types.IndexName {
	var res []types.IndexName

	for _, i := range t.IndexPatterns {
		res = append(res, types.IndexName(i))
	}

	return res
}

func getComposedOf(t *interactor.IndexTemplate) []types.Name {
	var res []types.Name

	for _, c := range t.ComponentTemplates {
		res = append(res, types.Name(c))
	}

	return res
}
