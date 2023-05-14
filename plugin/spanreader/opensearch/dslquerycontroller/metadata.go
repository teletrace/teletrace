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
	"context"
	"fmt"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/common"

	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
)

const SystemIdentifierEntryId = "system-id"

func (dc *dslQueryController) GetSystemId(ctx context.Context) (*metadata.GetSystemIdResponse, error) {
	res, err := dc.client.API.Get(dc.idx, SystemIdentifierEntryId)
	if err != nil {
		return nil, fmt.Errorf("Could not get system id %+v", err)
	}
	defer res.Body.Close()
	if res.StatusCode == 404 {
		return nil, nil
	}
	body, err := DecodeResponse(res)
	if err != nil {
		return nil, err
	}
	value := common.ParseSystemIdResponse(body)
	return &metadata.GetSystemIdResponse{Value: value}, nil
}

func (dc *dslQueryController) SetSystemId(ctx context.Context, req metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error) {
	reqBody, err := buildSetSystemIdBody(req.Value)
	if err != nil {
		return nil, fmt.Errorf("Could not set system id %+v", err)
	}

	res, err := dc.client.API.Index(
		dc.idx,
		reqBody,
		dc.client.API.Index.WithContext(ctx),
		dc.client.API.Index.WithOpType("create"),
		dc.client.API.Index.WithDocumentID(SystemIdentifierEntryId),
	)
	if err != nil {
		return nil, fmt.Errorf("Could not set system id %+v", err)
	}
	defer res.Body.Close()
	_, err = DecodeResponse(res)
	if err != nil {
		return nil, err
	}
	return &metadata.SetSystemIdResponse{}, nil
}
