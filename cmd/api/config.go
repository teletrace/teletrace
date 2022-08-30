package main

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

const (
	configFilename = "api"
	configFileExt  = "yaml"
	configPath     = "."
	defaultPort    = 8080
	defaultDebug   = true
)

type ApiConfig struct {
	Port  int  `mapstructure:"port"`
	Debug bool `mapstructure:"debug"`
}

// Creates ApiConfig based on prioritized sources
// defaults (lowest priority) < config env file < env variables (highest priority)
func createConfig() (ApiConfig, error) {
	c := ApiConfig{}
	v := viper.New()

	setDefaults(v)

	v.SetConfigName(configFilename)
	v.SetConfigType(configFileExt)
	v.AddConfigPath(configPath)

	err := v.ReadInConfig()
	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("Optional config file not found. Skipping")
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
	v.SetDefault("port", defaultPort)
	v.SetDefault("debug", defaultDebug)
}
