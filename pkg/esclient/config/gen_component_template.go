package config

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

// TODO change defaults with this function inputs
func NewComponentTemplate() (*interactor.ComponentTemplate, error) {
	comp_template := &interactor.ComponentTemplate{}

	if err := defaults.Set(comp_template); err != nil {
		return nil, err
	}

	return comp_template, nil
}
