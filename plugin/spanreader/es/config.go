package spanreaderes

import "oss-tracing/pkg/config"

type ElasticConfig struct {
	Endpoint     string
	Username     string
	Password     string
	ApiKey       string
	ServiceToken string
	Index        string
}

func NewElasticConfig(cfg config.Config) ElasticConfig {
	return ElasticConfig{
		Endpoint:     cfg.ESEndpoints,
		Username:     cfg.ESUsername,
		Password:     cfg.ESPassword,
		ApiKey:       cfg.ESAPIKey,
		ServiceToken: cfg.ESServiceToken,
		Index:        cfg.ESIndex,
	}
}
