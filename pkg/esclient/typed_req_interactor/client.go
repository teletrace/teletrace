package typedreqinteractor

import (
	"oss-tracing/pkg/config"

	"github.com/elastic/go-elasticsearch/v8"
	"go.uber.org/zap"
)

type Client struct {
	Client *elasticsearch.TypedClient
	Logger *zap.Logger
}

func NewClient(cfg config.Config, logger *zap.Logger) (*Client, error) {
	es_config := elasticsearch.Config{
		Addresses: []string{cfg.ESEndpoints},
		Username:  cfg.ESUsername,
		Password:  cfg.ESPassword,
	}

	if cfg.ESAPIKey != "" {
		es_config.APIKey = cfg.ESAPIKey
	}

	if cfg.ESServiceToken != "" {
		es_config.ServiceToken = cfg.ESServiceToken
	}

	es, err := elasticsearch.NewTypedClient(es_config)

	if err != nil {
		logger.Error("Could not create a new typed elasticsearch client %+v", zap.Error(err))
		return nil, err
	}

	return &Client{Client: es, Logger: logger}, nil
}
