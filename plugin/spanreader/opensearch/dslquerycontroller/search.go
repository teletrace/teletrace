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

	"github.com/opensearch-project/opensearch-go/opensearchapi"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/common"
)

func (dc *dslQueryController) Search(ctx context.Context, req spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	res, err := dc.performSearch(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("could not search spans: %+v", err)
	}

	body, err := common.DecodeResponse(res)
	if err != nil {
		switch err := err.(type) {
		case *common.OpenSearchError:
			if err.ErrorType == common.IndexNotFoundError {
				return &spansquery.SearchResponse{}, nil
			}
		default:
			return nil, fmt.Errorf("could not search spans: %+v", err)
		}
	}

	searchResp, err := common.ParseSpansResponse(body, common.WithMiliSecTimestampAsNanoSec())
	if err != nil {
		return nil, fmt.Errorf("could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func (dc *dslQueryController) performSearch(ctx context.Context, req spansquery.SearchRequest) (*opensearchapi.Response, error) {
	errMsg := "could not build search request: %+v"

	qc, err := BuildFiltersWithTimeFrame(req.SearchFilters, &req.Timeframe, WithMilliSecTimestampAsNanoSecFilter())
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	sa, err := BuildSearchAfter(req.Metadata.NextToken)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	body, err := MarshalBody(
		BuildQueryBody(
			WithQuery(qc),
			WithSort(BuildSort(req.Sort)),
			WithSearchAfter(sa),
			WithSize(50),
		),
	)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	opts := []func(*opensearchapi.SearchRequest){
		dc.client.Search.WithIndex(dc.idx),
		dc.client.Search.WithContext(ctx),
		dc.client.Search.WithBody(body),
	}

	res, err := dc.client.Search(opts...)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return res, nil
}
