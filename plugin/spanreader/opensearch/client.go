package spanreaderos

import (
	"github.com/opensearch-project/opensearch-go"
	"go.uber.org/zap"
)

func newClient(logger *zap.Logger, cfg OpenSearchConfig) (*opensearch.Client, error) {
	osConfig := opensearch.Config{
		Addresses: []string{cfg.Endpoint},
		Username:  cfg.Username,
		Password:  cfg.Password,
	}

	es, err := opensearch.NewClient(osConfig)
	if err != nil {
		logger.Error("Could not create a new raw elasticsearch client %+v", zap.Error(err))
		return nil, err
	}

	return es, nil
}
