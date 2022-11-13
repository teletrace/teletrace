package elasticsearchexporter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"

	"github.com/elastic/go-elasticsearch/v8/esutil"
	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
	"go.uber.org/zap"
)

var retryOnStatus = []int{500, 502, 503, 504, 429}

func writeSpan(ctx context.Context, logger *zap.Logger, index string, bi esutil.BulkIndexer, doc internalspanv1.InternalSpan, maxRetries int) error {
	var err error

	attempts := 1

	data, err := json.Marshal(&doc)

	if err != nil {
		return fmt.Errorf("Could not json marshal doc %+v: %+v", doc, err)
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
					logger.Error("Drop docs: failed to add docs to the bulk request buffer.",
						zap.NamedError("reason", err))

				case err != nil:
					logger.Error("Drop docs: failed to index",
						zap.String("name", index),
						zap.Int("attempt", attempts),
						zap.Int("status", resp.Status),
						zap.NamedError("reason", err))

				default:
					logger.Error(fmt.Sprintf("Drop dcos: failed to index: %#v", resp.Error),
						zap.Int("attempt", attempts),
						zap.Int("status", resp.Status))
				}
			},
		},
	)

	if err != nil {
		return fmt.Errorf("Could not add doc %+v to bulk: %+v ", doc, err)
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
