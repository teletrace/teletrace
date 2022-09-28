package rawreqinteractor

import (
	"context"
	"io"
	"io/ioutil"
	"oss-tracing/pkg/interactor/interactor"
	"strings"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

type ilmPolicyController struct {
	client Client
}

func NewILMPolicyController(client Client) interactor.ILMPolicyController {
	return &ilmPolicyController{client}
}

func (c *ilmPolicyController) ILMPolicyExists(name string) (*interactor.ExistsResponse, error) {
	var err error

	req := esapi.ILMGetLifecycleRequest{
		Policy: name,
	}
	res, err := req.Do(context.Background(), &c.client.Client)

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

func (c *ilmPolicyController) CreateILMPolicy(p *interactor.ILMPolicy) error {
	var err error

	req := esapi.ILMPutLifecycleRequest{
		Policy: p.Name,
		Body:   strings.NewReader(``),
	}

	_, err = req.Do(context.Background(), &c.client.Client)

	return err
}
