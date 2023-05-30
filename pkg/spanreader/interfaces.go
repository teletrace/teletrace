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

package spanreader

import (
	"context"

	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"

	"github.com/teletrace/teletrace/pkg/model/metadata/v1"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
)

type SpanReader interface {
	Initialize() error
	Search(ctx context.Context, r spansquery.SearchRequest) (*spansquery.SearchResponse, error)
	GetAvailableTags(ctx context.Context, r tagsquery.GetAvailableTagsRequest) (*tagsquery.GetAvailableTagsResponse, error)
	GetTagsValues(ctx context.Context, r tagsquery.TagValuesRequest, tags []string) (map[string]*tagsquery.TagValuesResponse, error)
	GetTagsStatistics(ctx context.Context, r tagsquery.TagStatisticsRequest, tag string) (*tagsquery.TagStatisticsResponse, error)
	GetHistograms(ctx context.Context, req aggsquery.HistogramsRequest) (*aggsquery.HistogramsResponse, error)
	GetSystemId(ctx context.Context, r metadata.GetSystemIdRequest) (*metadata.GetSystemIdResponse, error)
	SetSystemId(ctx context.Context, r metadata.SetSystemIdRequest) (*metadata.SetSystemIdResponse, error)
}
