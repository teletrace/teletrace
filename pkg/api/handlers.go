package api

import (
	"net/http"
	model "oss-tracing/pkg/model/spansquery/v1"
	"time"

	"github.com/gin-gonic/gin"
)

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) search(c *gin.Context) {
	var req model.SearchRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, &gin.H{"message": err.Error()})
		return
	}
	res, err := (*api.spanReader).Search(c, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, &gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (api *API) getTraceById(c *gin.Context) {
	traceId := c.Param("id")
	sr := &model.SearchRequest{
		Timeframe: model.Timeframe{
			StartTime: 0,
			EndTime:   uint64(time.Now().UnixNano()),
		},
		SearchFilters: []model.SearchFilter{
			{
				KeyValueFilter: &model.KeyValueFilter{
					Key:      "span.traceId",
					Operator: model.OPERATOR_EQUALS,
					Value:    traceId,
				},
			},
		},
	}

	res, err := (*api.spanReader).Search(c, sr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, &gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)

}
