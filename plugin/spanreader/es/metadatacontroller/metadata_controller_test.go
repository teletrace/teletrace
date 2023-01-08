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

package metadatacontroller

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func getSystemIdMock() (map[string]any, error) {
	var res map[string]any
	err := json.Unmarshal([]byte(`{
	"_index": "meta-lupa-traces",
	"_id": "system-id",
	"_version": 1,
	"_seq_no": 0,
	"_primary_term": 1,
	"found": true,
	"_source": {
		"value": "352b4249-ba14-4f8f-a439-a5df0812cf37"
	}
}`), &res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func TestParseGetSystemIdResponse(t *testing.T) {
	res, err := getSystemIdMock()
	value := parseSystemIdResponse(res)
	assert.Nil(t, err)
	assert.Equal(t, "352b4249-ba14-4f8f-a439-a5df0812cf37", value)
}
