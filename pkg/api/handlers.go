package api

import (
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
