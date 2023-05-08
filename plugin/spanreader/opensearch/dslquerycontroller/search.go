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
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/opensearch-project/opensearch-go/opensearchapi"
	"github.com/teletrace/teletrace/pkg/model"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/plugin/spanreader/opensearch/errors"
)

func (dc *dslQueryController) Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	res, err := dc.executeSearch(ctx, r)
	if err != nil {
		return nil, fmt.Errorf("Could not search spans: %+v", err)
	}

	body, err := DecodeResponse(res)
	if err != nil {
		switch err := err.(type) {
		case *errors.OpenSearchError:
			if err.ErrorType == errors.IndexNotFoundError {
				return &spansquery.SearchResponse{}, nil
			}
		default:
			return nil, fmt.Errorf("could not search spans: %+v", err)
		}
	}

	searchResp, err := parseSpansResponse(body, withMiliSecTimestampAsNanoSec())
	if err != nil {
		return nil, fmt.Errorf("Could not parse response body to spans: %+v", err)
	}

	return searchResp, nil
}

func (dc *dslQueryController) executeSearch(ctx context.Context, r spansquery.SearchRequest) (*opensearchapi.Response, error) {
	errMsg := "Could not build search request: %+v"

	searchBody, err := dc.buildBody(r)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	searchSort, err := dc.buildSort(r)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	res, err := dc.client.Search(
		dc.client.Search.WithIndex(dc.idx),
		dc.client.Search.WithContext(ctx),
		dc.client.Search.WithSize(50),
		dc.client.Search.WithSort(searchSort...),
		dc.client.Search.WithBody(searchBody),
	)
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	return res, nil
}

func (dc *dslQueryController) buildBody(r spansquery.SearchRequest) (io.Reader, error) {
	errMsg := "Could not build search body: %+v"

	timeframeFilters := CreateTimeframeFilters(&r.Timeframe)

	filters := append(r.SearchFilters, timeframeFilters...)

	var kvFilters []model.KeyValueFilter

	for _, f := range filters {
		if f.KeyValueFilter != nil {
			kvFilters = append(kvFilters, *f.KeyValueFilter)
		}
	}
	qc, err := BuildFilters(kvFilters, WithMilliSecTimestampAsNanoSec())
	if err != nil {
		return nil, fmt.Errorf(errMsg, err)
	}

	if qc == nil {
		return strings.NewReader(""), nil
	}
	jsQuery, err := json.Marshal(Body{Query: qc})
	if err != nil {
		return nil, fmt.Errorf("Failed to marshal query to json: %+v", err)
	}
	stringQuery := string(jsQuery)
	return strings.NewReader(stringQuery), nil
}

func (dc *dslQueryController) buildSort(r spansquery.SearchRequest) ([]string, error) {
	var sortSlice []string
	return sortSlice, nil
}
