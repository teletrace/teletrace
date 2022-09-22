package esclient

import (
	"io"
	"net/http"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi"
	"go.uber.org/zap"
)

type Client interface {
	CreateIndex(index string)
	IndexExists(index string)
	DeleteIndex(index string)
	CreateTemplate(template)
	IndexTemplateExists(template)
}

type ClientHandler struct {
	client elasticsearch.Client
	api    typedapi.API
	logger *zap.Logger
}

type ClientResponse struct {
	StatusCode int
	Header     http.Header
	Body       io.ReadCloser
}
