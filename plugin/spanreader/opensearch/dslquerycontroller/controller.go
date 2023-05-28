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

package dslquerycontroller

import (
	"github.com/opensearch-project/opensearch-go"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/querycontroller"
	"go.uber.org/zap"
)

type dslQueryController struct {
	client *opensearch.Client
	idx    string
}

func NewDslQueryController(logger *zap.Logger, client *opensearch.Client, idx string) querycontroller.QueryController {
	return &dslQueryController{client: client, idx: idx}
}
