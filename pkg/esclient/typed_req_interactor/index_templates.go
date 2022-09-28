package typedreqinteractor

import (
	"context"
	"errors"

	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/indices/putindextemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type indexTemplateController struct {
	client Client
}

func NewIndexTemplateController(client Client) interactor.IndexTemplateController {
	return &indexTemplateController{client: client}
}

func (c *indexTemplateController) IndexTemplateExists(name string) (*interactor.ExistsResponse, error) {
	var err error
	exists, err := c.client.Client.API.Indices.ExistsIndexTemplate(name).IsSuccess(context.Background())
	if err != nil {
		return nil, err
	}
	return &interactor.ExistsResponse{Exists: exists}, nil

}

func (c *indexTemplateController) CreateIndexTemplate(t *interactor.IndexTemplate) error {
	var err error

	template := putindextemplate.NewRequestBuilder().
		Template(types.NewIndexTemplateMappingBuilder().
			Settings(types.NewIndexSettingsBuilder().
				NumberOfShards("1").
				NumberOfReplicas("1").
				Lifecycle(types.NewIndexSettingsLifecycleBuilder().
					Name("ILM_POLICY"),
				),
			),
		).Build()

	res, err := c.client.Client.API.Indices.PutIndexTemplate(t.Name).Request(template).Do(context.Background())

	if err != nil {
		return err
	}

	res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 400 {
		return nil
	} else {
		return errors.New(res.Status)
	}

}
