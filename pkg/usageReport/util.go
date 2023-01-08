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
 package usageReport

import (
	"context"
	"github.com/google/uuid"
	"oss-tracing/pkg/model/metadata/v1"
	"oss-tracing/pkg/spanreader"
	"time"
)

func GetSystemId(sr spanreader.SpanReader, ctx context.Context) (string, error) {
	queryCtx, cancelFunc := context.WithTimeout(ctx, 10*time.Second)
	defer cancelFunc()
	systemIdRes, err := sr.GetSystemId(queryCtx, metadata.GetSystemIdRequest{})
	if err != nil {
		return "", err
	}
	if systemIdRes == nil {
		systemId := uuid.New().String()
		if _, err := sr.SetSystemId(queryCtx, metadata.SetSystemIdRequest{
			Value: systemId,
		}); err != nil {
			return "", err
		}
		return systemId, nil
	}
	return systemIdRes.Value, nil

}
