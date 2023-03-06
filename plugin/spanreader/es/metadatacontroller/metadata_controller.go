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
package metadatacontroller

import (
	"context"
	"fmt"

	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	"github.com/teletrace/teletrace/plugin/spanreader/es/utils"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/optype"
	"go.uber.org/zap"
)

const SystemIdentifierEntryId = "system-id"

type metadataController struct {
	client *elasticsearch.TypedClient
	idx    string
}

func NewMetadataController(logger *zap.Logger, client *elasticsearch.TypedClient, idx string) (MetadataController, error) {
	return &metadataController{
		client: client,
		idx:    idx,
	}, nil
}

func parseSystemIdResponse(body map[string]any) string {
	return body["_source"].(map[string]any)["value"].(string)
}

func (mc *metadataController) GetSystemId(
	ctx context.Context,
) (*metadata.GetSystemIdResponse, error) {
	res, err := mc.client.API.Get(mc.idx, SystemIdentifierEntryId).Do(ctx)
	if err != nil {
		return nil, fmt.Errorf("Could not get system id %+v", err)
	}
	defer res.Body.Close()
	if res.StatusCode == 404 {
		return nil, nil
	}
	body, err := utils.DecodeResponse(res)
	if err != nil {
		return nil, err
	}
	value := parseSystemIdResponse(body)
	return &metadata.GetSystemIdResponse{Value: value}, nil
}

func (mc *metadataController) SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	res, err := mc.client.API.Index(mc.idx).Id(SystemIdentifierEntryId).Request(map[string]string{"value": r.Value}).OpType(optype.Create).Do(ctx)
	if err != nil {
		return nil, fmt.Errorf("Could not set system id %+v", err)
	}
	defer res.Body.Close()
	_, err = utils.DecodeResponse(res)
	if err != nil {
		return nil, err
	}
	return &metadata.SetSystemIdResponse{}, nil
}
