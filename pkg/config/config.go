package config

import (
	"fmt"

	"github.com/spf13/viper"
	"go.uber.org/zap"
)

const (
	configFilename = "config"
	configFileExt  = "yaml"
	configPath     = "."

	DebugEnvName = "DEBUG"
	DebugDefault = true

	apiPortEnvName = "API_PORT"
	apiPortDefault = 8080
)

// Config defines global configurations used throughout the application
type Config struct {
	Debug   bool `mapstructure:"debug"`
	APIPort int  `mapstructure:"api_port"`
}

// NewConfig creates a Config based on prioritized sources
// default values (lowest priority) < config file < env variables (highest priority)
func NewConfig(logger *zap.Logger) (Config, error) {
	c := Config{}
	v := viper.New()

	setDefaults(v)

	v.SetConfigName(configFilename)
	v.SetConfigType(configFileExt)
	v.AddConfigPath(configPath)

	err := v.ReadInConfig()
	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			logger.Info("Optional config file not found. Skipping")
		} else {
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
	v.SetDefault(DebugEnvName, DebugDefault)
	v.SetDefault(apiPortEnvName, apiPortDefault)
}
