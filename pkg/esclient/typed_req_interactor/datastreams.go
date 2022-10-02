package typedreqinteractor

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/index"
)

type dataStreamController struct {
	client Client
}

func NewIndexController(client Client) interactor.DataStreamController {
	return &dataStreamController{client: client}
}

func (c *dataStreamController) DataStreamExists(name string) (*interactor.ExistsResponse, error) {
	var err error

	exists, err := c.client.Client.API.Indices.Exists(name).IsSuccess(context.Background())

	if err != nil {
		return nil, err
	}

	return &interactor.ExistsResponse{Exists: exists}, nil
}

func (c *dataStreamController) CreateDataStream(d *interactor.DataStream) error {
	_, err := index.New(&c.client.Client).Index(d.Name).Do(context.Background())

	if err != nil {
		return err
	}

	return nil
}
