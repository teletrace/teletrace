package typedreqinteractor

import (
	"context"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type documentController struct {
	client *Client
}

func NewDocumentController(client *Client) interactor.DocumentController {
	return &documentController{client: client}
}

func (c *documentController) Search(ctx context.Context, r *interactor.SearchRequest) error {
	var err error

	builder = createQueryContainerBuilder()

	req = search.NewRequestBuilder().Query(createQueryContainerBuilder())
}

func createQueryContainerBuilder(fs ...*interactor.SearchFilter) (*types.QueryContainerBuilder, error) {

}
