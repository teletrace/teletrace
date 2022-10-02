package spanformatutil

import (
	"encoding/json"
	lupa_v1 "oss-tracing/pkg/model/extracted_span/generated/v1"

	v1 "go.opentelemetry.io/proto/otlp/common/v1"
)

// TODO very inefficient
func ExplodeSpans(s ...*lupa_v1.ExtractedSpan) ([]*map[string]any, []error) {
	var spans []map[string]interface{}

	data, _ := json.Marshal(s)
	json.Unmarshal(data, &spans)

	for _, span := range spans {
		span["Span"]["Attributes"] = explodeOtelKeyValue(span["Span"]["Attributes"])
	}
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

func resolveAnyValue(v *v1.AnyValue) any { // TODO Switch case
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
