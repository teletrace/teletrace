package config

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

//TODO change defaults with this functions input
func NewIndexTemplate() (interactor.IndexTemplate, error) {
	index_template := &interactor.IndexTemplate{}

	if err := defaults.Set(index_template); err != nil {
		return nil, err
	}

	index_template.IndexPatterns = append(index_template.IndexPatterns, GenIndexName())

	return index_template, nil
}
