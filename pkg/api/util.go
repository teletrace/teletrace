package api

import "github.com/gin-gonic/gin"

type errorResponse struct {
	Error string `json:"error"`
}

func respondWithError(statusCode int, err error, c *gin.Context) {
	errResponse := &errorResponse{Error: err.Error()}
	c.JSON(statusCode, errResponse)
}
