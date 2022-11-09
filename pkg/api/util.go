package api

import "github.com/gin-gonic/gin"

type errorResponse struct {
	ErrorMessage string `json:"errorMessage"`
}

func respondWithError(statusCode int, err error, c *gin.Context) {
	errResponse := &errorResponse{ErrorMessage: err.Error()}
	c.JSON(statusCode, errResponse)
}
