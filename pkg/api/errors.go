package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type errorType int

const (
	inputError  errorType = iota
	serverError errorType = iota
)

type errorResponse struct {
	Message string `json:"message"`
}

type apiError struct {
	message    string
	httpStatus int
}

func (err *apiError) Error() string {
	return err.message
}

func throwApiError(err error, errorType errorType, c *gin.Context) {
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

	c.Error(apiErr)
}

func errorHandler(c *gin.Context) {
	c.Next()

	for _, err := range c.Errors {
		respondWithError(err, c)
		return
	}
}

func respondWithError(err error, c *gin.Context) {
	errorMessage := err.Error()
	errResponse := &errorResponse{Message: errorMessage}
	switch err.(type) {
	case *apiError:
		apiError := err.(*apiError)
		c.JSON(apiError.httpStatus, errResponse)
		return
	default:
		c.JSON(http.StatusInternalServerError, errResponse)
		return
	}
}
