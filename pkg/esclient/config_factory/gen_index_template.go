package configfactory

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

//TODO get input from config pkg and override if needed
func NewIndexTemplate() (*interactor.IndexTemplate, error) {
	index_template := &interactor.IndexTemplate{}

	if err := defaults.Set(index_template); err != nil {
		return nil, err
	}

	return index_template, nil
}
