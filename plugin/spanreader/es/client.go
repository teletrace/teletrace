package spanreaderes

import (
	"github.com/elastic/go-elasticsearch/v8"
	"go.uber.org/zap"
)

func newTypedClient(logger *zap.Logger, cfg ElasticConfig) (*elasticsearch.TypedClient, error) {
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

	es, err := elasticsearch.NewTypedClient(esConfig)

	if err != nil {
		logger.Error("Could not create a new typed elasticsearch client %+v", zap.Error(err))
		return nil, err
	}

	return es, nil
}

func newRawClient(logger *zap.Logger, cfg ElasticConfig) (*elasticsearch.Client, error) {
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

	return es, nil
}
