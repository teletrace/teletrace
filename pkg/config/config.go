package config

import (
	"fmt"

	"github.com/spf13/viper"
)

const (
	configFilename = "config"
	configFileExt  = "yaml"
	configPath     = "."

	debugEnvName = "DEBUG"
	debugDefault = true

	apiPortEnvName = "API_PORT"
	apiPortDefault = 8080

	esEndpointEnvName = "ES_ENDPOINT"
	esEndpointDefault = "http://0.0.0.0:9200"

	esUsernameEnvName = "ES_USERNAME"
	esUsernameDefault = "elastic"

	esPasswordEnvName = "ES_PASSWORD"
	esPasswordDefault = ""

	esApiKeyEnvName = "ES_API_KEY"
	esApiKeyDefault = ""

	esServiceTokenEnvName = "ES_SERVICE_TOKEN"
	esServiceTokenDefault = ""

	esForceCreateConfigEnvName = "ES_FORCE_CREATE_CONFIG"
	esForceCreateConfigDefault = false

	esIndexEnvName = "ES_INDEX"
	esIndexDefault = "lupa-traces"

	esIndexerWorkersCountEnvName = "ES_INDEXER_WORKERS_COUNT"
	esIndexerWorkersCountDefault = 5

	esIndexerFlushThresholdSecondsEnvName = "ES_INDEXER_FLUSH_THRESHOLD_SECONDS"
	esIndexerFlushThresholdSecondsDefault = 30
)

// Config defines global configurations used throughout the application.
type Config struct {
	Debug   bool `mapstructure:"debug"`
	APIPort int  `mapstructure:"api_port"`

	// Elasticsearch configs
	ESEndpoints                    string `mapstructure:"es_endpoint"`
	ESUsername                     string `mapstructure:"es_username"`
	ESPassword                     string `mapstructure:"es_password"`
	ESAPIKey                       string `mapstructure:"es_api_key"`
	ESServiceToken                 string `mapstructure:"es_service_token"`
	ESForceCreateConfig            bool   `mapstructure:"es_force_create_config"`
	ESIndex                        string `mapstructure:"es_index"`
	ESIndexerWorkersCount          int    `mapstructure:"es_indexer_workers_count"`
	ESIndexerFlushThresholdSeconds int    `mapstructure:"es_indexer_flush_threshold_seconds"`
}

// NewConfig creates and returns a Config based on prioritized sources.
// default values (lowest priority) < config file < env variables (highest priority)
func NewConfig() (Config, error) {
	c := Config{}
	v := viper.New()

	setDefaults(v)

	v.SetConfigName(configFilename)
	v.SetConfigType(configFileExt)
	v.AddConfigPath(configPath)

	err := v.ReadInConfig()
	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return c, fmt.Errorf("error loading config file %s: %w", configPath, err)
		}
	}

	// overrides config file with env variables
	v.AutomaticEnv()

	err = v.Unmarshal(&c)
	if err != nil {
		return c, fmt.Errorf("error unmarshaling config to struct: %w", err)
	}

	return c, nil
}

func setDefaults(v *viper.Viper) {
	v.SetDefault(debugEnvName, debugDefault)
	v.SetDefault(apiPortEnvName, apiPortDefault)

	// Elasticsearch defaults
	v.SetDefault(esEndpointEnvName, esEndpointDefault)
	v.SetDefault(esUsernameEnvName, esUsernameDefault)
	v.SetDefault(esPasswordEnvName, esPasswordDefault)
	v.SetDefault(esApiKeyEnvName, esApiKeyDefault)
	v.SetDefault(esServiceTokenEnvName, esServiceTokenDefault)
	v.SetDefault(esForceCreateConfigEnvName, esForceCreateConfigDefault)
	v.SetDefault(esIndexEnvName, esIndexDefault)
	v.SetDefault(esIndexerFlushThresholdSecondsEnvName, esIndexerFlushThresholdSecondsDefault)
	v.SetDefault(esIndexerWorkersCountEnvName, esIndexerWorkersCountDefault)
}
