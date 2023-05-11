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
