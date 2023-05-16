/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package common

import (
	"encoding/json"
	"fmt"

	"github.com/opensearch-project/opensearch-go/opensearchapi"
)

const (
	IndexNotFoundError string = "index_not_found_exception"
	Unknown            string = "unknown"
)

type OpenSearchError struct {
	Message    string
	HttpStatus string
	ErrorType  string
}

func (e OpenSearchError) Error() string {
	return e.Message
}

func OSErrorFromHttpResponse(status string, body map[string]any) (*OpenSearchError, error) {
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
	return &OpenSearchError{
		Message:    message,
		HttpStatus: status,
		ErrorType:  finalErrorType,
	}, nil
}

// If the response contains an error, this function returns an error that summarize it
func SummarizeResponseError(res *opensearchapi.Response) error {
	if !res.IsError() {
		return nil
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return fmt.Errorf("error parsing the response body: %s", err)
	} else {
		esError, err := OSErrorFromHttpResponse(res.Status(), body)
		if err != nil {
			return err
		}
		return esError
	}
}
