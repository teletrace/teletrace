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
	"net/http"
	"time"

	"github.com/teletrace/teletrace/pkg/model"
	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"

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
	handleTimeframe(&req.Timeframe)

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
	handleTimeframe(req.Timeframe)

	tag := c.Param("tag")

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

func (api *API) tagsStatistics(c *gin.Context) {
	var req tagsquery.TagStatisticsRequest
	isValidationError := api.validateRequestBody(&req, c)
	if isValidationError {
		return
	}
	handleTimeframe(req.Timeframe)

	tag := c.Param("tag")

	res, err := (*api.spanReader).GetTagsStatistics(c, req, tag)
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, res)
}

func handleTimeframe(t *model.Timeframe) {
	if t != nil {
		if t.EndTime == 0 {
			t.EndTime = uint64(time.Now().UnixNano())
		}
	}
}

func (api *API) getSystemInfo(c *gin.Context) {
	res, err := (*api.spanReader).GetSystemId(c, metadata.GetSystemIdRequest{})
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, metadata.GetSystemInfoResponse{
		SystemId: res.Value,
	})
}
