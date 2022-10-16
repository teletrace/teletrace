package config

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

// TODO change defaults with this function inputs
func NewComponentTemplate() (*interactor.ComponentTemplate, error) {
	compTemplate := &interactor.ComponentTemplate{}

	if err := defaults.Set(compTemplate); err != nil {
		return nil, err
	}

	return compTemplate, nil
}
