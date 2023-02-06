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

package metadata

type GetSystemIdRequest struct{}

type GetSystemIdResponse struct {
	Value string `json:"value"`
}

type SetSystemIdRequest struct {
	Value string `json:"value"`
}

type SetSystemIdResponse struct{}

type GetSystemInfoResponse struct {
	SystemId              string `json:"systemId"`
	UsageReportingEnabled bool   `json:"usageReportingEnabled"`
}
