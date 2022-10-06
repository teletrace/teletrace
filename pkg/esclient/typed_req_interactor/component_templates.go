package typedreqinteractor

import (
	"context"
	"fmt"
	"net/http/httputil"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/cluster/putcomponenttemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/segmentsortorder"
	"go.uber.org/zap"
)

type componentTemplateController struct {
	client Client
	cfg    config.Config
}

func NewComponentTemplateController(client Client, cfg config.Config) interactor.ComponentTemplateController {
	return &componentTemplateController{client: client, cfg: cfg}

}

func (c *componentTemplateController) ComponentTemplateExists(ctx context.Context, name string) (*interactor.ExistsResponse, error) {
	var err error
	exists, err := c.client.Client.API.Cluster.ExistsComponentTemplate(name).IsSuccess(ctx)
	if err != nil {
		return nil, err
	}
	return &interactor.ExistsResponse{Exists: exists}, nil
}

func (c *componentTemplateController) CreateComponentTemplate(ctx context.Context, t *interactor.ComponentTemplate) error {
	var err error

	template := putcomponenttemplate.NewRequestBuilder().
		Template(types.NewIndexStateBuilder().
			Mappings(types.NewTypeMappingBuilder().
				DynamicTemplates([]map[string]types.DynamicTemplate{
					{
						"all_string_fields": types.NewDynamicTemplateBuilder().
							PathMatch("*").
							Mapping(types.NewPropertyBuilder().
								KeywordProperty(types.NewKeywordPropertyBuilder().
									IgnoreAbove(256),
								),
							).
							MatchMappingType("string").Build(),
					},
				}).
				Properties(map[types.PropertyName]*types.PropertyBuilder{
					types.NewPropertyNameBuilder().PropertyName(types.PropertyName(t.TimestampField)).Build(): types.NewPropertyBuilder().
						DateProperty(types.NewDatePropertyBuilder().
							Format(t.TimestampFormat).IgnoreMalformed(false),
						),
				}),
			).
			Settings(types.NewIndexSettingsBuilder().
				Index(types.NewIndexSettingsBuilder().
					Mapping(types.NewMappingLimitSettingsBuilder().
						TotalFields(types.NewMappingLimitSettingsTotalFieldsBuilder().
							Limit(t.MaxTotalFields),
						).
						IgnoreMalformed(true),
					).
					Sort(getIndexSort(t)),
				),
			),
		).Build()

	res, err := c.client.Client.API.Cluster.PutComponentTemplate(t.Name).Request(template).Do(ctx)

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

		return fmt.Errorf("Could not create component template: %s, status code %d", string(respDump), res.StatusCode)
	}
}

func getIndexSort(t *interactor.ComponentTemplate) *types.IndexSegmentSortBuilder {
	var fields []types.Field
	var orders []segmentsortorder.SegmentSortOrder

	for _, i := range t.IndexSort {
		if i.Order == "asc" {
			orders = append(orders, segmentsortorder.Asc)
		} else if i.Order == "desc" {
			orders = append(orders, segmentsortorder.Desc)
		} else {
			return nil
		}
		fields = append(fields, types.Field(i.Field))
	}

	return types.NewIndexSegmentSortBuilder().
		Order(orders).
		Field(types.NewFieldsBuilder().
			Fields(fields),
		)
}
