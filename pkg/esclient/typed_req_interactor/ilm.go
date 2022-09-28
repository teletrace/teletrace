package typedreqinteractor

import (
	"context"
	"errors"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/elastic/go-elasticsearch/v8/typedapi/ilm/putlifecycle"
	"github.com/elastic/go-elasticsearch/v8/typedapi/indices/putindextemplate"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type ilmPolicyController struct {
	client interactor.Client
}

func NewILMPolicyController() interactor.ILMPolicyController {
	return &ilmPolicyController{}
}

func (c *ilmPolicyController) ILMPolicyExists(name string) (*interactor.ExistsResponse, error) {
	var err error
	exists, err := c.client.Api.Ilm.GetLifecycle().Policy(name).IsSuccess(context.Background())
	if err != nil {
		return nil, err
	}
	return &interactor.ExistsResponse{Exists: exists}, nil

}

func (c *ilmPolicyController) CreateILMPolicy(p *interactor.ILMPolicy) error {
	var err error
    // Configurations(types.NewConfigurationsBuilder().
    //                     Rollover(types.NewRolloverConditionsBuilder().
    //                         MaxPrimaryShardSize(types.NewByteSizeBuilder().
    //                             String("30gb"),
    //                         ),
    //                     ),
    //                 )

    policy := putlifecycle.NewPutLifecycleFunc(c.client.Client.BaseClient.Transport)(p.Name).Request(putlifecycle.NewRequestBuilder().Policy())

    esapi.IndicesPutIndexTemplateRequest
    
    ilm := c.client.Client.ILM.PutLifecycle(p.Name, esapi.ILMPutLifecycleRequest{Policy:policy, Body:}



    // policy := types.NewIlmBuilder().
    //     PolicyStats([]types.IlmPolicyStatisticsBuilder{*types.NewIlmPolicyStatisticsBuilder().
    //         Phases(types.NewPhasesBuilder().
    //             Hot(types.NewPhaseBuilder().
    //                 MinAge(0).
    //                 Configurations(types.NewConfigurationsBuilder().
    //                     Rollover(types.NewRolloverConditionsBuilder().
    //                         MaxPrimaryShardSize(types.NewByteSizeBuilder().
    //                             String("30gb"),
    //                         ),
    //                     ),
    //                 ),
    //             ).Delete(types.NewPhaseBuilder().
    //                 MinAge(2592000000),
    //             ),
    //         ),
    //     }).Build()

    c.client.Api.Ilm.PutLifecycle().Policy().Request(putlifecycle.NewRequestBuilder().Policy(policy) )
	res, err := c.client.Api.Indices.PutIndexTemplate(t.Name).Request(template).Do(context.Background())

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
