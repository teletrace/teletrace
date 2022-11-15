package config

import (
	"oss-tracing/plugin/spanstorage/es/interactor"

	"github.com/creasty/defaults"
)

func NewIndexTemplate(idx string) (*interactor.IndexTemplate, error) {
	indexTemplate := &interactor.IndexTemplate{}

	if err := defaults.Set(indexTemplate); err != nil {
		return nil, err
	}

	indexTemplate.IndexPatterns = append(indexTemplate.IndexPatterns, idx)

	return indexTemplate, nil
}
