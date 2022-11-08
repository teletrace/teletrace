package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ApiError struct {
	message   string
	errorType int64
}

func errorHandler(c *gin.Context) {
	c.Next()

	for _, err := range c.Errors {
		c.JSON(http.StatusInternalServerError, &ApiError{message: err.Error()})
		return
	}
}
