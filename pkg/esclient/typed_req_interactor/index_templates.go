package typedreqinteractor

import (
	"context"
	"errors"
	"strconv"

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
		DataStream(types.NewDataStreamVisibilityBuilder().Hidden(false)).
		IndexPatterns(types.NewIndicesBuilder().Indices(getIndexPatterns(t))).
		Template(types.NewIndexTemplateMappingBuilder().
			Settings(types.NewIndexSettingsBuilder().
				NumberOfShards(strconv.Itoa(t.NumberOfShards)).
				NumberOfReplicas(strconv.Itoa(t.NumberOfReplicas)).
				Lifecycle(types.NewIndexSettingsLifecycleBuilder().
					Name(types.Name(t.ILMPolicyName)),
				),
			),
		).Build()

	res, err := c.client.Client.API.Indices.PutIndexTemplate(t.Name).Request(template).Do(ctx)

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

func getIndexPatterns(t *interactor.IndexTemplate) []types.IndexName {
	var res []types.IndexName

	for i, _ := range t.IndexPatterns {
		res = append(res, types.IndexName(i))
	}

	return res
}
