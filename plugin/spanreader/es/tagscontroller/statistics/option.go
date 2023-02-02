package statistics

import (
	"oss-tracing/pkg/model"
	"oss-tracing/pkg/model/tagsquery/v1"
	spanreaderes "oss-tracing/plugin/spanreader/es/utils"
)

type TagStatisticParseOption func(string, map[tagsquery.TagStatistic]float64, tagsquery.TagStatistic)

func WithMilliSecTimestampAsNanoSec(tag string, statistics map[tagsquery.TagStatistic]float64, s tagsquery.TagStatistic) {
	if spanreaderes.IsConvertedTimestamp(model.FilterKey(tag)) {
		statistics[s] = spanreaderes.MilliToNanoFloat64(statistics[s])
	}
}
