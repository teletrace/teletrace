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
	"github.com/teletrace/teletrace/pkg/model"
	"golang.org/x/exp/slices"
)

var convertedTimestampKeys = []model.FilterKey{"span.startTimeUnixNano", "span.endTimeUnixNano", "externalFields.durationNano"}

func IsConvertedTimestamp(key model.FilterKey) bool {
	return slices.Contains(convertedTimestampKeys, key)
}

func MilliToNanoFloat64(millis float64) float64 {
	return millis * 1e6
}

func NanoToMilliUint64(nanos uint64) uint64 {
	return nanos / 1e6
}

func NanoToMilliFloat64(nanos float64) float64 {
	return nanos / 1e6
}
