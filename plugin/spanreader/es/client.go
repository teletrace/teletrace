/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
