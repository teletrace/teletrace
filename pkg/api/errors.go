package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var errorTypeToHttpStatus map[errorType]int = map[errorType]int{
	inputError:  http.StatusBadRequest,
	serverError: http.StatusInternalServerError,
}

type errorType int

const (
	inputError  errorType = iota
	serverError errorType = iota
)

type errorResponse struct {
	Message string `json:"message"`
}

func respondWithError(err error, errorType errorType, c *gin.Context) {
	errorMessage := err.Error()
	errResponse := &errorResponse{Message: errorMessage}
	httpStatus := errorTypeToHttpStatus[errorType]
	c.JSON(httpStatus, errResponse)
}
