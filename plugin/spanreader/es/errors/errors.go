package errors

import "fmt"

const (
	IndexNotFoundError string = "index_not_found_exception"
	Unknown            string = "unknown"
)

type ElasticSearchError struct {
	Message    string
	HttpStatus string
	ErrorType  string
}

func (e ElasticSearchError) Error() string {
	return e.Message
}

func ESErrorFromHttpResponse(status string, body map[string]any) (*ElasticSearchError, error) {
	errorMap := body["error"]
	if errorMap == nil {
		return nil, fmt.Errorf("missing 'error' object in response: %+v", body)
	}

	errorType := errorMap.(map[string]any)["type"]
	errorReason := errorMap.(map[string]any)["reason"]
	message := "an error occurred"
	switch errorReason := errorReason.(type) {
	case string:
		message = errorReason
	}

	finalErrorType := Unknown
	switch errorType := errorType.(type) {
	case string:
		finalErrorType = errorType
	}
	return &ElasticSearchError{
		Message:    message,
		HttpStatus: status,
		ErrorType:  finalErrorType,
	}, nil
}
