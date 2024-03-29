/**
 * Copyright 2022 Cisco Systems, Inc.
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

package elasticsearchexporter

import (
	"fmt"

	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8"
)

func newClient(logger *zap.Logger, cfg *Config) (*elasticsearch.Client, error) {
	esConfig, err := elasticsearch.NewClient(elasticsearch.Config{
		// basic connection setup
		Addresses: cfg.Endpoints,
		Username:  cfg.Username,
		Password:  cfg.Password,
		APIKey:    cfg.APIKey,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating Elasticsearch Client: %+v", err)
	}

	return esConfig, nil
}
