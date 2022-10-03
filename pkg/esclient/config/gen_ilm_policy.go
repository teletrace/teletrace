package config

import (
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/esclient/interactor"

	"github.com/creasty/defaults"
)

func NewILMPolicy(cfg config.Config) (*interactor.ILMPolicy, error) {
	ilm_policy := &interactor.ILMPolicy{}

	if err := defaults.Set(ilm_policy); err != nil {
		return nil, err
	}

	return ilm_policy, nil
}
