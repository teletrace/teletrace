package spanformatutil

import (
	"encoding/json"
	lupa_v1 "oss-tracing/pkg/model/extracted_span/generated/v1"

	v1 "go.opentelemetry.io/proto/otlp/common/v1"
)

// TODO very inefficient
func ExplodeSpans(s ...*lupa_v1.ExtractedSpan) (*[]map[string]any, error) {
	var spans []map[string]any

	for _, e_span := range s {
		// overrides attributes with new map object
		// then encode to json

		span := map[string]any{
			"span": map[string]any{
				"attributes": map[string]any{},
			},
			"resource": map[string]any{
				"attributes": map[string]any{},
			},
			"scope": map[string]any{
				"attributes": map[string]any{},
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

		if a, ok := span["span"].(map[string]any); ok {
			if _, ok := a["attributes"].(map[string]any); ok {
				a["attributes"] = s_attr
			}
		}
		if a, ok := span["resource"].(map[string]any); ok {
			if _, ok := a["attributes"].(map[string]any); ok {
				a["attributes"] = r_attr
			}
		}
		if a, ok := span["scope"].(map[string]any); ok {
			if _, ok := a["attributes"].(map[string]any); ok {
				a["attributes"] = i_attr
			}
		}

		spans = append(spans, span)

	}

	return &spans, nil
}

func explodeOtelKeyValue(kvs ...*v1.KeyValue) map[string]any {
	var res map[string]any

	for _, kv := range kvs {
		key := kv.Key
		value := resolveAnyValue(kv.Value)

		res[key] = value
	}

	return res
}

func resolveAnyValue(v *v1.AnyValue) any {
	if x, ok := v.GetValue().(*v1.AnyValue_BoolValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*v1.AnyValue_BytesValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*v1.AnyValue_IntValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*v1.AnyValue_DoubleValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*v1.AnyValue_StringValue); ok {
		return x
	}

	if x, ok := v.GetValue().(*v1.AnyValue_ArrayValue); ok {
		var val []any
		for _, v := range x.ArrayValue.Values {
			val = append(val, resolveAnyValue(v))
		}
		return val
	}

	if x, ok := v.GetValue().(*v1.AnyValue_KvlistValue); ok {
		var val []any
		for _, v := range x.KvlistValue.Values {
			val = append(val, explodeOtelKeyValue(v))
		}

		return val
	}

	return nil
}
