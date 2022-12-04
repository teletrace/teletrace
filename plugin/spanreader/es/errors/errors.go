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
	errorMap, errorMapExists := body["error"]
	if !errorMapExists {
		return nil, fmt.Errorf("missing 'error' object in response: %+v", body)
	}

	errorReason, reasonExists := errorMap.(map[string]any)["reason"]
	errorType, typeExists := errorMap.(map[string]any)["type"]

	message := "an error occurred"
	if !reasonExists {
		message = errorReason.(string)
	}
	finalErrorType := Unknown
	if !typeExists {
		finalErrorType = errorType.(string)
	}
	return &ElasticSearchError{
		Message:    message,
		HttpStatus: status,
		ErrorType:  finalErrorType,
	}, nil
}
