package esclient

import (
	"context"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

func (h *ClientHandler) LupaIndicesExist(indices []string) (bool, error) {
	var err error

	req := esapi.IndicesExistsRequest{Index: indices}
	res, err := req.Do(context.Background(), &h.client)
	if err != nil {
		return false, err // TODO do not return bool, but a nillable response
	} else {
		return res.IsError(), nil
	}
}
