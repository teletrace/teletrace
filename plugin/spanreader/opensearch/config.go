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
