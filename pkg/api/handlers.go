package api

import (
	"net/http"
	model "oss-tracing/pkg/model/spansquery/v1"

	"github.com/gin-gonic/gin"
)

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) search(c *gin.Context) {
	var req model.SearchRequest
	err := c.BindJSON(&req)
	if err != nil {
		respondWithError(err, inputError, c)
		return
	}
	res, err := (*api.spanReader).Search(c, &req)
	if err != nil {
		respondWithError(err, serverError, c)
		return
	}
	c.JSON(http.StatusOK, res)
}
