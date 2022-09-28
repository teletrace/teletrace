package typedreqinteractor

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/indices/putindextemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/segmentsortorder"
)

type componentTemplateController struct {
	client Client
}

func NewComponentTemplateController(client Client) interactor.ComponentTemplateController {
	return &componentTemplateController{client: client}
}

func (c *componentTemplateController) ComponentTemplateExists(name string) (*interactor.ExistsResponse, error) {
	var err error
	exists, err := c.client.Client.API.Cluster.ExistsComponentTemplate(name).IsSuccess(context.Background())
	if err != nil {
		return nil, err
	}
	return &interactor.ExistsResponse{Exists: exists}, nil
}

func (c *componentTemplateController) CreateComponentTemplate(t *interactor.ComponentTemplate) error {
	var err error

	template := putindextemplate.NewRequestBuilder().
		Template(types.NewIndexTemplateMappingBuilder().
			Mappings(types.NewTypeMappingBuilder().
				DynamicTemplates([]map[string]types.DynamicTemplate{
					map[string]types.DynamicTemplate{
						"all_string_fields": types.NewDynamicTemplateBuilder().
							PathMatch("*").
							Mapping(types.NewPropertyBuilder().
								NestedProperty(types.NewNestedPropertyBuilder().
									IgnoreAbove(256),
								),
							).
							MatchMappingType("string").Build(),
					},
				}).
				Properties(map[types.PropertyName]*types.PropertyBuilder{
					types.NewPropertyNameBuilder().PropertyName("@timestamp").Build(): types.NewPropertyBuilder().
						DateProperty(types.NewDatePropertyBuilder().
							Format(t.TimestampFormat).IgnoreMalformed(false),
						),
				}),
			).
			Settings(types.NewIndexSettingsBuilder().
				Index(types.NewIndexSettingsBuilder().
					Mapping(types.NewMappingLimitSettingsBuilder().
						TotalFields(types.NewMappingLimitSettingsTotalFieldsBuilder().
							Limit(1000),
						).
						IgnoreMalformed(true),
					).
					Sort(types.NewIndexSegmentSortBuilder().
						Order([]segmentsortorder.SegmentSortOrder{segmentsortorder.Desc}).
						Field(types.NewFieldsBuilder().Fields([]types.Field{"@timestamp"})),
					),
				),
			),
		).Build()

	res, err := c.client.Client.API.Indices.PutIndexTemplate(name).Request(template).Do(context.Background())

	if err != nil {
		return err
	}

	res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 400 {
		return nil
	} else {
		return fmt.Errorf("Could not create index template, status code %s", res.StatusCode)
	}
}
