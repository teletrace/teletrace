package searchcontroller

import (
	"encoding/json"
	"fmt"
	spansquery "oss-tracing/pkg/model/spansquery/v1"

	internalspan "github.com/epsagon/lupa/model/internalspan/v1"
	"github.com/mitchellh/mapstructure"
)

type SpanParseOption func(*internalspan.InternalSpan)

func parseSpansResponse(body map[string]any, opts ...SpanParseOption) (*spansquery.SearchResponse, error) {
	var err error

	hits := body["hits"].(map[string]any)["hits"].([]any)

	spans := []*internalspan.InternalSpan{}
	for _, h := range hits {
		hit := h.(map[string]any)["_source"].(map[string]any)
		var s internalspan.InternalSpan
		err = mapstructure.Decode(hit, &s)
		for _, opt := range opts {
			opt(&s)
		}
		if err != nil {
			return nil, fmt.Errorf("Could not decode response hit from elasticsearch: %+v", err)
		}
		spans = append(spans, &s)
	}

	var metadata *spansquery.Metadata
	if len(hits) > 0 {
		metadata = &spansquery.Metadata{}
		if err := extractNextToken(hits, metadata); err != nil {
			return nil, err
		}
	}

	return &spansquery.SearchResponse{
		Spans:    spans,
		Metadata: metadata,
	}, nil
}

func extractNextToken(hits []any, metadata *spansquery.Metadata) error {
	if lastHitSortData := hits[len(hits)-1].(map[string]any)["sort"]; lastHitSortData != nil {
		lastHitSortData := lastHitSortData.([]any)
		if len(lastHitSortData) == 0 {
			return nil
		}
		tokenFields := make([]string, len(lastHitSortData))
		for i, key := range lastHitSortData {
			tokenFields[i] = fmt.Sprintf("%v", key)
		}
		jsonToken, err := json.Marshal(tokenFields)
		if err != nil {
			return err
		}
		metadata.NextToken = spansquery.ContinuationToken(jsonToken)

	}
	return nil
}

func withMiliSecTimestampAsNanoSec() SpanParseOption {
	return func(s *internalspan.InternalSpan) {
		s.Span.StartTimeUnixNano = s.Span.StartTimeUnixNano * 1000 * 1000
		s.Span.EndTimeUnixNano = s.Span.StartTimeUnixNano * 1000 * 1000

		for _, e := range s.Span.Events {
			e.TimeUnixNano = e.TimeUnixNano * 1000 * 1000
		}

		s.ExternalFields.DurationNano = s.ExternalFields.DurationNano * 1000 * 1000
	}
}
