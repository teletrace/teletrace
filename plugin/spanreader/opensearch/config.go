package spanreaderos

import (
	"fmt"

	"github.com/teletrace/teletrace/pkg/config"
)

type OpenSearchConfig struct {
	Endpoint string
	Username string
	Password string
	Index    string
}

func NewOpenSearchConfig(cfg config.Config) OpenSearchConfig {
	return OpenSearchConfig{
		Endpoint: cfg.OSEndpoints,
		Username: cfg.OSUsername,
		Password: cfg.OSPassword,
		Index:    cfg.OSIndex,
	}
}

func NewOpenSearchMetaConfig(cfg config.Config) OpenSearchConfig {
	return OpenSearchConfig{
		Endpoint: cfg.OSEndpoints,
		Username: cfg.OSUsername,
		Password: cfg.OSPassword,
		Index:    fmt.Sprintf("meta-%s", cfg.OSIndex),
	}
}
