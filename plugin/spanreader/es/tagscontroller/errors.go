package tagscontroller

import (
	"encoding/json"
	"fmt"
	"oss-tracing/plugin/spanreader/es/errors"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

// If the response contains an error, this function returns an error that summarize it
func SummarizeResponseError(res *esapi.Response) error {
	if !res.IsError() {
		return nil
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return fmt.Errorf("error parsing the response body: %s", err)
	} else {
		return errors.ESErrorFromHttpResponse(res.Status(), body)
	}
}
