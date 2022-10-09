package spanformatutil

import (
	common_v1 "go.opentelemetry.io/proto/otlp/common/v1"
)

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
		return x.BoolValue
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_BytesValue); ok {
		return x.BytesValue
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_IntValue); ok {
		return x.IntValue
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_DoubleValue); ok {
		return x.DoubleValue
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_StringValue); ok {
		return x.StringValue
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_ArrayValue); ok {
		var val []any
		for _, v := range x.ArrayValue.Values {
			val = append(val, resolveAnyValue(v))
		}
		return val
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_KvlistValue); ok {
		var val []any
		for _, v := range x.KvlistValue.Values {
			val = append(val, explodeOtelKeyValue(v))
		}

		return val
	}

	return nil
}
