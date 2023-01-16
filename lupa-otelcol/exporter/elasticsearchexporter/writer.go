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

package elasticsearchexporter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esutil"
	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
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

func writeSpans(ctx context.Context, logger *zap.Logger, c *elasticsearch.Client, index string, spans ...*internalspanv1.InternalSpan) error {
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
			errs = append(errs, (fmt.Errorf("Cannot encode span with id %v: %v", span.Span.SpanId, err)))
		}

		data = append(data, "\n"...)
		buf.Grow(len(meta) + len(data))
		buf.Write(meta)
		buf.Write(data)
	}
	res, err := c.Bulk(bytes.NewReader(buf.Bytes()), c.Bulk.WithIndex(index))
	if err != nil { // handle errs from runtime
		errs = append(errs, fmt.Errorf("Failure indexing %d spans: %s", numItems, err))
	}
	if res.IsError() { // handle errs from es
		if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
			errs = append(errs, fmt.Errorf("Failure to parse response body: %v", err))
		} else {
			errs = append(errs, fmt.Errorf("Failure indexing %d spans: %s", numItems, err))
			errs = append(errs, fmt.Errorf("  Error: [%d] %s: %s",
				res.StatusCode,
				raw["error"].(map[string]interface{})["type"],
				raw["error"].(map[string]interface{})["reason"],
			))
		}
	} else { // handle errs from single spans in bulk
		if err := json.NewDecoder(res.Body).Decode(&blk); err != nil {
			errs = append(errs, fmt.Errorf("Failure to parse response body: %v", err))
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

func writeSpan(ctx context.Context, logger *zap.Logger, index string, bi esutil.BulkIndexer, doc *internalspanv1.InternalSpan, maxRetries int) error {
	var err error

	attempts := 1

	data, err := json.Marshal(&doc)
	if err != nil {
		return fmt.Errorf("could not json marshal doc %+v: %+v", doc, err)
	}

	body := bytes.NewReader(data)

	err = bi.Add(
		ctx,
		esutil.BulkIndexerItem{
			Action: "create",
			Body:   body,
			OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, resp esutil.BulkIndexerResponseItem, err error) {
				switch {
				case attempts < maxRetries && shouldRetryEvent(resp.Status):
					logger.Debug("Retrying to index",
						zap.String("name", index),
						zap.Int("attempt", attempts),
						zap.Int("status", resp.Status),
						zap.NamedError("reason", err))

					attempts++
					_, _ = body.Seek(0, io.SeekStart)
					_ = bi.Add(ctx, item)

				case resp.Status == 0 && err != nil:
					// Encoding error. We didn't even attempt to send the event
					logger.Error("drop docs: failed to add docs to the bulk request buffer.",
						zap.NamedError("reason", err))

				case err != nil:
					logger.Error("drop docs: failed to index",
						zap.String("name", index),
						zap.Int("attempt", attempts),
						zap.Int("status", resp.Status),
						zap.NamedError("reason", err))

				default:
					logger.Error(fmt.Sprintf("drop docs: failed to index: %#v", resp.Error),
						zap.Int("attempt", attempts),
						zap.Int("status", resp.Status))
				}
			},
		},
	)

	if err != nil {
		return fmt.Errorf("could not add doc %+v to bulk: %v ", doc, err)
	}

	return nil
}

func shouldRetryEvent(status int) bool {
	for _, retryable := range retryOnStatus {
		if status == retryable {
			return true
		}
	}
	return false
}
