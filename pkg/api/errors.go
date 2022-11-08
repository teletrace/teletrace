package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Maps an error type to it's approprate http status
var errorTypeToHttpStatus map[errorType]int = map[errorType]int{
	inputError:  http.StatusBadRequest,
	serverError: http.StatusInternalServerError,
}

type errorType int

// An enum of explicit error types
const (
	inputError  errorType = iota
	serverError errorType = iota
)

// Represents an error http response
type errorResponse struct {
	Message string `json:"message"`
}

// Determine which errorResponse to build given a raised error
// Respond with the appropriate http status and body
func respondWithError(err error, errorType errorType, c *gin.Context) {
	errorMessage := err.Error()
	errResponse := &errorResponse{Message: errorMessage}
	httpStatus := errorTypeToHttpStatus[errorType]
	c.JSON(httpStatus, errResponse)
}
