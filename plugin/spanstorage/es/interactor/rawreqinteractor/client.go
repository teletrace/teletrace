package rawreqinteractor

import (
	"oss-tracing/plugin/spanstorage/es/interactor"

	"github.com/elastic/go-elasticsearch/v8"
	"go.uber.org/zap"
)

type Client struct {
	Client *elasticsearch.Client
	Logger *zap.Logger
}

func NewClient(logger *zap.Logger, cfg interactor.ElasticConfig) (*Client, error) {
	esConfig := elasticsearch.Config{
		Addresses: []string{cfg.Endpoint},
		Username:  cfg.Username,
		Password:  cfg.Password,
	}

	if cfg.ApiKey != "" {
		esConfig.APIKey = cfg.ApiKey
	}

	if cfg.ServiceToken != "" {
		esConfig.ServiceToken = cfg.ServiceToken
	}

	es, err := elasticsearch.NewClient(esConfig)

	if err != nil {
		logger.Error("Could not create a new raw elasticsearch client %+v", zap.Error(err))
		return nil, err
	}

	return &Client{Client: es, Logger: logger}, nil
}
