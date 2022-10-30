package es

import (
	"context"
	"fmt"
	"oss-tracing/pkg/esclient/interactor"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
)

type spanReader struct {
	documentController interactor.DocumentController
}

func (w *spanReader) Search(ctx context.Context, r *spansquery.SearchRequest) (*spansquery.SearchResponse, error) {
	var err error

	res, err := w.documentController.Search(ctx, r)

	if err != nil {
		return nil, fmt.Errorf("Could not index document: %+v", err)
	}

	return res, nil
}
