package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

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

// Represents an error that was raised from the API
// Holds information on how to build the error http response
type apiError struct {
	message    string
	httpStatus int
}

func (err *apiError) Error() string {
	return err.message
}

// Converts an error into an api error and inserts it to the gin context
func raiseApiError(err error, errorType errorType, c *gin.Context) {
	var apiErr *apiError
	switch errorType {
	case inputError:
		apiErr = &apiError{
			message:    err.Error(),
			httpStatus: http.StatusBadRequest,
		}
	default:
		apiErr = &apiError{
			message:    err.Error(),
			httpStatus: http.StatusInternalServerError,
		}
	}

	_ = c.Error(apiErr)
}

// Middleware that handles all errors thrown within gin context
func errorHandler(c *gin.Context) {
	c.Next()

	for _, err := range c.Errors {
		respondWithError(err, c)
		return
	}
}

// Determine which errorResponse to return given a raised error
// Respond with the appropriate http status and body
func respondWithError(err error, c *gin.Context) {
	errorMessage := err.Error()
	errResponse := &errorResponse{Message: errorMessage}
	switch err := err.(type) {
	case *apiError:
		c.JSON(err.httpStatus, errResponse)
		return
	default:
		c.JSON(http.StatusInternalServerError, errResponse)
		return
	}
}
