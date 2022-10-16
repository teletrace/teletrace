package typedreqinteractor

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8"
	"go.uber.org/zap"
)

type Client struct {
	Client *elasticsearch.TypedClient
	Logger *zap.Logger
}

func NewClient(logger *zap.Logger, cfg interactor.ElasticConfig) (*Client, error) {
	es_config := elasticsearch.Config{
		Addresses: []string{cfg.Endpoint},
		Username:  cfg.Username,
		Password:  cfg.Password,
	}

	if cfg.ApiKey != "" {
		es_config.APIKey = cfg.ApiKey
	}

	if cfg.ServiceToken != "" {
		es_config.ServiceToken = cfg.ServiceToken
	}

	es, err := elasticsearch.NewTypedClient(es_config)

	if err != nil {
		logger.Error("Could not create a new typed elasticsearch client %+v", zap.Error(err))
		return nil, err
	}

	return &Client{Client: es, Logger: logger}, nil
}
