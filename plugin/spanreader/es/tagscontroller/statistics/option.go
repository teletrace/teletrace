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

package statistics

import (
	"github.com/teletrace/teletrace/pkg/model"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	spanreaderes "github.com/teletrace/teletrace/plugin/spanreader/es/utils"
)

type TagStatisticParseOption func(string, map[tagsquery.TagStatistic]float64, tagsquery.TagStatistic)

func WithMilliSecTimestampAsNanoSec() TagStatisticParseOption {
	return func(tag string, statistics map[tagsquery.TagStatistic]float64, s tagsquery.TagStatistic) {
		if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
			statistics[s] = spanreaderes.MilliToNanoFloat64(statistics[s])
		}
	}
}
