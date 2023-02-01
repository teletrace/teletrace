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

package opensearchexporter

import (
	"context"
	"fmt"
	"github.com/opensearch-project/opensearch-go"
	"github.com/opensearch-project/opensearch-go/opensearchutil"

	"go.uber.org/zap"
)

func newClient(logger *zap.Logger, cfg *Config) (*opensearch.Client, error) {
	esConfig, err := opensearch.NewClient(opensearch.Config{

		// basic connection setup
		Addresses: cfg.Endpoints,
		Username:  cfg.Username,
		Password:  cfg.Password,
	})

	if err != nil {
		return nil, fmt.Errorf("error creating OpenSearch Client: %+v", err)
	}

	return esConfig, nil
}

func newBulkIndexer(logger *zap.Logger, client *opensearch.Client, cfg *Config) (opensearchutil.BulkIndexer, error) {
	var err error

	bi, err := opensearchutil.NewBulkIndexer(opensearchutil.BulkIndexerConfig{
		Index:         cfg.Index,
		Client:        client,
		NumWorkers:    cfg.WorkersCount,
		FlushInterval: cfg.Flush.Interval,
		FlushBytes:    cfg.Flush.Bytes,

		OnError: func(_ context.Context, err error) {
			logger.Error(fmt.Sprintf("bulk indexer error: %v", err))
		},
	})

	if err != nil {
		return nil, fmt.Errorf("error creating the indexer: %v", err)
	}

	return bi, nil
}
