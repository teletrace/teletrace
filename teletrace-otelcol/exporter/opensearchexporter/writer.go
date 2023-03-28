/**
* Copyright 2020, OpenTelemetry Authors
* Modifications copyright (C) 2022 Cisco Systems, Inc.
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

package opensearchexporter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"

	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
	"github.com/opensearch-project/opensearch-go"
	"go.uber.org/multierr"
	"go.uber.org/zap"
)

var retryOnStatus = []int{500, 502, 503, 504, 429}

type bulkResponse struct {
	Errors bool `json:"errors"`
	Items  []struct {
		Index struct {
			ID     string `json:"_id"`
			Result string `json:"result"`
			Status int    `json:"status"`
			Error  struct {
				Type   string `json:"type"`
				Reason string `json:"reason"`
				Cause  struct {
					Type   string `json:"type"`
					Reason string `json:"reason"`
				} `json:"caused_by"`
			} `json:"error"`
		} `json:"index"`
	} `json:"items"`
}

func writeSpans(ctx context.Context, logger *zap.Logger, c *opensearch.Client, index string, spans ...*internalspanv1.InternalSpan) error {
	var errs []error
	var buf bytes.Buffer
	var raw map[string]interface{}
	var blk bulkResponse

	numItems := 0

	for _, span := range spans {
		numItems++
		meta := []byte(fmt.Sprintf(`{ "index" : { "_id" : "%s" } }%s`, span.Span.SpanId, "\n"))
		data, err := json.Marshal(span)
		if err != nil {
			errs = append(errs, (fmt.Errorf("Cannot encode span with id %v: %w", span.Span.SpanId, err)))
		}

		data = append(data, "\n"...)
		buf.Grow(len(meta) + len(data))
		buf.Write(meta)
		buf.Write(data)
	}
	res, err := c.Bulk(bytes.NewReader(buf.Bytes()), c.Bulk.WithIndex(index))
	if err != nil { // handle errs from runtime
		errs = append(errs, fmt.Errorf("Failure indexing %d spans: %w", numItems, err))
	}
	if res.IsError() { // handle errs from es
		if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
			errs = append(errs, fmt.Errorf("Failure to parse response body: %w", err))
		} else {
			errs = append(errs, fmt.Errorf("Failure indexing %d spans: %w", numItems, err))
			errs = append(errs, fmt.Errorf("  Error: [%d] %s: %s",
				res.StatusCode,
				raw["error"].(map[string]interface{})["type"],
				raw["error"].(map[string]interface{})["reason"],
			))
		}
	} else { // handle errs from single spans in bulk
		if err := json.NewDecoder(res.Body).Decode(&blk); err != nil {
			errs = append(errs, fmt.Errorf("Failure to parse response body: %w", err))
		} else {
			for _, d := range blk.Items {
				if d.Index.Status > 201 {
					errs = append(errs, fmt.Errorf("  Error: [%d]: %s: %s: %s: %s",
						d.Index.Status,
						d.Index.Error.Type,
						d.Index.Error.Reason,
						d.Index.Error.Cause.Type,
						d.Index.Error.Cause.Reason,
					))
				}
			}
		}
	}

	res.Body.Close()

	return multierr.Combine(errs...)
}
