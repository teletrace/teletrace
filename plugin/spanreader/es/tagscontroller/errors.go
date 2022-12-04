/**
 * Copyright 2022 Epsagon
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

package tagscontroller

import (
	"encoding/json"
	"fmt"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

// If the response contains an error, this function returns an error that summarize it
func SummarizeResponseError(res *esapi.Response) error {
	if !res.IsError() {
		return nil
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return fmt.Errorf("error parsing the response body: %s", err)
	} else {
		status := res.Status()
		errorType := body["error"].(map[string]any)["type"]
		errorReason := body["error"].(map[string]any)["reason"]
		return fmt.Errorf("error response - status=[%s], type=%v, reason: %v",
			status, errorType, errorReason)
	}
}
