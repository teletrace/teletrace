package esclient

import (
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

//TODO get input from config pkg and override if needed
func NewIndexTemplate(cfg config.Config) (*interactor.IndexTemplate, error) {
	index_template := &interactor.IndexTemplate{}

	if err := defaults.Set(index_template); err != nil {
		return nil, err
	}

	index_template.IndexPatterns = append(index_template.IndexPatterns, GenIndexName(cfg))

	return index_template, nil
}
