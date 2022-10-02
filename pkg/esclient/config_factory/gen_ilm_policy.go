package configfactory

import (
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

func NewILMPolicy() (*interactor.ILMPolicy, error) {
	ilm_policy := &interactor.ILMPolicy{}

	if err := defaults.Set(ilm_policy); err != nil {
		return nil, err
	}

	return ilm_policy, nil
}
