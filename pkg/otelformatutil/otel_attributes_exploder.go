package otelformatutil

import (
	common_v1 "go.opentelemetry.io/proto/otlp/common/v1"
)

func ExplodeOtelKeyValue(kvs ...*common_v1.KeyValue) (map[string]any, error) {
	res := make(map[string]any, len(kvs))

	for _, kv := range kvs {
		key := kv.Key
		value, err := resolveAnyValue(kv.Value)

		if err != nil {
			return nil, err
		}

		res[key] = value
	}

	return res, nil
}

func resolveAnyValue(v *common_v1.AnyValue) (any, error) {
	if x, ok := v.GetValue().(*common_v1.AnyValue_BoolValue); ok {
		return x.BoolValue, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_BytesValue); ok {
		return x.BytesValue, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_IntValue); ok {
		return x.IntValue, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_DoubleValue); ok {
		return x.DoubleValue, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_StringValue); ok {
		return x.StringValue, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_ArrayValue); ok {
		var val []any
		for _, v := range x.ArrayValue.Values {
			r, err := resolveAnyValue(v)
			if err != nil {
				return nil, err
			}
			val = append(val, r)
		}
		return val, nil
	} else if x, ok := v.GetValue().(*common_v1.AnyValue_KvlistValue); ok {
		var val []any
		for _, v := range x.KvlistValue.Values {
			exp, err := ExplodeOtelKeyValue(v)
			if err != nil {
				return nil, err
			}
			val = append(val, exp)
		}

		return val, nil
	}

	return nil, nil
}
