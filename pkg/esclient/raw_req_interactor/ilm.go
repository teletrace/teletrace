package rawreqinteractor

import (
	"context"
	"io"
	"io/ioutil"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/elastic/go-elasticsearch/v8/esutil"
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
		return &interactor.ExistsResponse{Exists: false}, err
	}

	io.Copy(ioutil.Discard, res.Body)
	err = res.Body.Close()
	if err != nil {
		return &interactor.ExistsResponse{Exists: false}, err
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
		Body:   esutil.NewJSONReader(p),
	}

	_, err = req.Do(ctx, &c.client.Client)

	return err
}
