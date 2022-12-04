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

package api

import "github.com/gin-gonic/gin"

type errorResponse struct {
	ErrorMessage string `json:"errorMessage"`
}

func respondWithError(statusCode int, err error, c *gin.Context) {
	errResponse := &errorResponse{ErrorMessage: err.Error()}
	c.JSON(statusCode, errResponse)
}
