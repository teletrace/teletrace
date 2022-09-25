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

	grpcEndpointEnvName = "GRPC_ENDPOINT"
	grpcEndpointDefault = "0.0.0.0:4317"

	httpEndpointEnvName = "HTTP_ENDPOINT"
	httpEndpointDefault = "0.0.0.0:4318"
)

// Config defines global configurations used throughout the application.
type Config struct {
	Debug        bool   `mapstructure:"debug"`
	APIPort      int    `mapstructure:"api_port"`
	GRPCEndpoint string `mapstructure:"grpc_endpoint"`
	HTTPEndpoint string `mapstructure:"http_endpoint"`
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
	v.SetDefault(grpcEndpointEnvName, grpcEndpointDefault)
	v.SetDefault(httpEndpointEnvName, httpEndpointDefault)
}
