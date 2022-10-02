package configfactory

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

func NewIndex() (*interactor.Index, error) {
	index := &interactor.Index{}

	if err := defaults.Set(index); err != nil {
		return nil, err
	}

	return index, nil
}
