package spanformatutil

import (
	"encoding/json"

	v1 "oss-tracing/pkg/model/extracted_span/generated/v1"

	common_v1 "go.opentelemetry.io/proto/otlp/common/v1"
)

// TODO very inefficient
func FlattenSpans(s ...*v1.ExtractedSpan) ([]*map[string]any, error) {
	var spans []*map[string]any

	for _, e_span := range s {
		// overrides attributes with new map object
		// then encode to json

		span := map[string]any{
			"Span": map[string]any{
				"Attributes": map[string]any{},
			},
			"Resource": map[string]any{
				"Attributes": map[string]any{},
			},
			"Scope": map[string]any{
				"Attributes": map[string]any{},
			},
		}

		s_attr := explodeOtelKeyValue(e_span.Span.Attributes...)
		r_attr := explodeOtelKeyValue(e_span.Resource.Attributes...)
		i_attr := explodeOtelKeyValue(e_span.Scope.Attributes...)

		data, _ := json.Marshal(e_span)
		err := json.Unmarshal(data, &span)

		if err != nil {
			return nil, err
		}

		if a, ok := span["Span"].(map[string]any); ok {
			if _, ok := a["Attributes"].(map[string]any); ok {
				a["Attributes"] = s_attr
			}
		}
		if a, ok := span["Resource"].(map[string]any); ok {
			if _, ok := a["Attributes"].(map[string]any); ok {
				a["Attributes"] = r_attr
			}
		}
		if a, ok := span["Scope"].(map[string]any); ok {
			if _, ok := a["Attributes"].(map[string]any); ok {
				a["Attributes"] = i_attr
			}
		}

		spans = append(spans, &span)

	}

	return spans, nil
}

func explodeOtelKeyValue(kvs ...*common_v1.KeyValue) map[string]any {
	res := make(map[string]any, len(kvs))

	for _, kv := range kvs {
		key := kv.Key
		value := resolveAnyValue(kv.Value)

		res[key] = value
	}

	return res
}

func resolveAnyValue(v *common_v1.AnyValue) any {
	if x, ok := v.GetValue().(*common_v1.AnyValue_BoolValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_BytesValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_IntValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_DoubleValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_StringValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_ArrayValue); ok {
		var val []any
		for _, v := range x.ArrayValue.Values {
			val = append(val, resolveAnyValue(v))
		}
		return val
	}

	if x, ok := v.GetValue().(*common_v1.AnyValue_KvlistValue); ok {
		var val []any
		for _, v := range x.KvlistValue.Values {
			val = append(val, explodeOtelKeyValue(v))
		}

		return val
	}

	return nil
}
