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

package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"oss-tracing/pkg/model"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"time"

	"github.com/gin-gonic/gin"
)

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) search(c *gin.Context) {
	var req spansquery.SearchRequest
	isValidationError := api.validateRequestBody(&req, c)
	if isValidationError {
		return
	}
	res, err := (*api.spanReader).Search(c, req)
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}
	c.JSON(http.StatusOK, res)
}

func (api *API) getTraceById(c *gin.Context) {
	traceId := c.Param("id")
	sr := &spansquery.SearchRequest{
		Timeframe: model.Timeframe{
			StartTime: 0,
			EndTime:   uint64(time.Now().UnixNano()),
		},
		SearchFilters: []model.SearchFilter{
			{
				KeyValueFilter: &model.KeyValueFilter{
					Key:      "span.traceId",
					Operator: spansquery.OPERATOR_EQUALS,
					Value:    traceId,
				},
			},
		},
	}

	res, err := (*api.spanReader).Search(c, *sr)
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, res)
}

func (api *API) getAvailableTags(c *gin.Context) {
	res, err := (*api.spanReader).GetAvailableTags(c, tagsquery.GetAvailableTagsRequest{})
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, res)
}

func (api *API) tagsValues(c *gin.Context) {
	var req tagsquery.TagValuesRequest
	isValidationError := api.validateRequestBody(&req, c)
	if isValidationError {
		return
	}
	tag := c.Param("tag")
	j, _ := json.Marshal(req)
	fmt.Printf("tag: %s, req: %s\n", tag, j)
	res, err := (*api.spanReader).GetTagsValues(c, req, []string{tag})
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	tagValues := res[tag]
	if tagValues == nil {
		tagValues = &tagsquery.TagValuesResponse{}
	}

	c.JSON(http.StatusOK, tagValues)
}
