package interactor

import "oss-tracing/pkg/config"

func NewElasticConfig(cfg config.Config) ElasticConfig {
	return ElasticConfig{
		Endpoint:     cfg.ESEndpoints,
		Username:     cfg.ESUsername,
		Password:     cfg.ESPassword,
		ApiKey:       cfg.ESAPIKey,
		ServiceToken: cfg.ESServiceToken,
		ForceCreate:  cfg.ESForceCreateConfig,
		Index:        cfg.ESIndex,
	}
}
