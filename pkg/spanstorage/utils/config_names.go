package utils

type ConfigurationNameGenerator interface {
	GetIndexTemplateName() string
	GetComponentTemplateName() string
	GetILMPolicyName() string
	GetSpanIndexName() string
	GetSpanDataStreamName() string
}

type LupaConfigurationNameGenerator struct {
	prefix          string
	span_store_name string
}

func (g *LupaConfigurationNameGenerator) GetIndexTemplateName() { // TODO check formatting in Jaeger

}
