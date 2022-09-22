package esclient

import (
	"context"
	"net/http"

	"github.com/elastic/go-elasticsearch/v8/typedapi/indices/putindextemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/segmentsortorder"
)

type LupaTemplateExistsResponse struct {
	exists bool
}

type NonPayloadResponse struct {
	res *http.Response
}

func (r *NonPayloadResponse) IsSuccess() bool {
	if r.res.StatusCode >= 200 && r.res.StatusCode < 400 {
		return true
	} else {
		return false
	}
}

func (h *ClientHandler) TemplateExists() (*LupaTemplateExistsResponse, error) {
	var err error

	name := "TEMPLATE" // TODO: get name with a util function

	exists, err := h.api.Indices.ExistsIndexTemplate(name).IsSuccess(context.Background())
	if err != nil {
		return nil, err
	} else {
		return &LupaTemplateExistsResponse{exists: exists}, nil
	}
}

func (h *ClientHandler) CreateComponentTemplate() (bool, error) {
	var err error

	name := "TEMPLATE"

	date_format := "yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd||yyyy-MM-dd'T'HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSSSS||epoch_millis"

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
							Format(date_format).IgnoreMalformed(false),
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

	res, err := h.api.Indices.PutIndexTemplate(name).Request(template).Do(context.Background())

	non_payload_res := NonPayloadResponse{res: res}

	if err != nil || !non_payload_res.IsSuccess() {
		return false, err
	} else {
		return non_payload_res.IsSuccess(), nil
	}

}

func (h *ClientHandler) CreateIndexTemplate() (bool, error) {
	var err error

	name := "INDEX_TEMPLATE"

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

	res, err := h.api.Indices.PutIndexTemplate(name).Request(template).Do(context.Background())

	if err != nil {
		return false, err
	}

	res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 400 {
		return true, nil
	} else {
		return false, nil //TODO
	}

}
