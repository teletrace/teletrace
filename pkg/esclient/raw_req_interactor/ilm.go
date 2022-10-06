package rawreqinteractor

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"
	"strings"

	"github.com/elastic/go-elasticsearch/v8/esapi"
	"go.uber.org/zap"
)

type ilmPolicyController struct {
	client Client
	cfg    config.Config
}

func NewILMPolicyController(client Client, cfg config.Config) interactor.ILMPolicyController {
	return &ilmPolicyController{client: client, cfg: cfg}
}

func (c *ilmPolicyController) ILMPolicyExists(ctx context.Context, name string) (*interactor.ExistsResponse, error) {
	var err error

	req := esapi.ILMGetLifecycleRequest{
		Policy: name,
	}
	res, err := req.Do(ctx, &c.client.Client)

	if err != nil {
		return &interactor.ExistsResponse{Exists: false}, fmt.Errorf("Could not Do request: %+v", err)
	}

	err = res.Body.Close()
	if err != nil {
		return &interactor.ExistsResponse{Exists: false}, fmt.Errorf("Could not close response Body: %+v", err)
	}

	if res.StatusCode >= 200 && res.StatusCode < 300 {
		return &interactor.ExistsResponse{Exists: true}, nil
	}

	return &interactor.ExistsResponse{Exists: false}, nil

}

func (c *ilmPolicyController) CreateILMPolicy(ctx context.Context, p *interactor.ILMPolicy) error {
	var err error

	req := esapi.ILMPutLifecycleRequest{
		Policy: p.Name,
		Body:   strings.NewReader(CreateJsonFromPolicy(p)),
	}

	res, err := req.Do(ctx, &c.client.Client)

	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 400 {
		return nil
	} else {
		resBody, err := io.ReadAll(res.Body)
		if err != nil {
			c.client.Logger.Fatal("Could not dump response: %+v ", zap.Error(err))
		}
		return fmt.Errorf("Could not create ilm policy: %s, status code %d", string(resBody), res.StatusCode)
	}
}

func CreateJsonFromPolicy(p *interactor.ILMPolicy) string {
	// pol := fmt.Sprintf(`{\"policy\":{\"phases\":{\"hot\":{\"min_age\":\"0ms\",\"actions\":{\"set_priority\":{\"priority\":100},\"rollover\":{\"max_primary_shard_size\":\"%s\"}}},\"delete\":{\"min_age\":\"%s\",\"actions\":{\"delete\":{\"delete_searchable_snapshot\":true}}}}}}`, p.Rollover, p.DeleteAfter)

	// b, _ := json.Marshal(pol)
	// return esutil.NewJSONReader(b)

	type delete struct {
		delete_searchable_snapshot bool
	}

	type rollover struct {
		max_primary_shard_size string
	}

	type set_priority struct {
		priority int
	}

	type hot_actions struct {
		set_priority set_priority
		rollover     rollover
	}
	type delete_actions struct {
		delete delete
	}

	type hot_phase struct {
		min_age string
		actions hot_actions
	}

	type delete_phase struct {
		min_age string
		actions delete_actions
	}

	type policy struct {
		hot    hot_phase
		delete delete_phase
	}

	type req struct {
		policy policy
	}

	_r := req{
		policy: policy{
			hot: hot_phase{
				min_age: "0ms",
				actions: hot_actions{
					set_priority: set_priority{priority: 100},
					rollover:     rollover{max_primary_shard_size: p.Rollover},
				},
			},
			delete: delete_phase{
				min_age: "0ms",
				actions: delete_actions{
					delete: delete{
						delete_searchable_snapshot: true,
					},
				},
			},
		},
	}

	b, _ := json.Marshal(_r)

	return string(b)
}
