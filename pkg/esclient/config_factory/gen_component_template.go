package configfactory

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

// TODO get input from config pkg
func NewComponentTemplate() (*interactor.ComponentTemplate, error) {
	comp_template := &interactor.ComponentTemplate{}

	if err := defaults.Set(comp_template); err != nil {
		return nil, err
	}

	return comp_template, nil
}
