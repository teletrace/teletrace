package elasticsearchexporter

import (
	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch"
	internalspan "github.com/epsagon/lupa/model/internalspanv1"
)

type elasticsearchTracesExporter struct {
	logger *zap.Logger

	idx         string
	client      *elasticsearch.Client
	bulkIndexer interface{}
	model       internalspan.InternalSpan
}

func newTracesExporter() {

}
