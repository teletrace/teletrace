package otelformatutil

import (
	"testing"

	"github.com/stretchr/testify/assert"
	v1 "go.opentelemetry.io/proto/otlp/common/v1"
	"google.golang.org/protobuf/encoding/protojson"
)

func TestSpanFormatUtil_ExplodeKeyValue(t *testing.T) {
	str_attr := `{
            "key":"intValue",
            "value":{
                "intValue":1
            }
         }`
	int_attr := `{
            "key":"stringValue",
            "value":{
                "stringValue":"str"
            }
         }`

	bool_attr := `{
            "key":"boolValue",
            "value":{
                "boolValue":true
            }
         }`

	float_attr := `{
            "key":"doubleValue",
            "value":{
                "doubleValue":1.23
            }
         }`
	otel_int_attr := v1.KeyValue{}
	otel_str_attr := v1.KeyValue{}
	otel_bool_attr := v1.KeyValue{}
	otel_float_attr := v1.KeyValue{}

	assert.NoError(t, protojson.Unmarshal([]byte(str_attr), &otel_str_attr))
	assert.NoError(t, protojson.Unmarshal([]byte(int_attr), &otel_int_attr))
	assert.NoError(t, protojson.Unmarshal([]byte(bool_attr), &otel_bool_attr))
	assert.NoError(t, protojson.Unmarshal([]byte(float_attr), &otel_float_attr))

	exploded_attrs, err := ExplodeOtelKeyValue(
		&otel_int_attr,
		&otel_str_attr,
		&otel_bool_attr,
		&otel_float_attr,
	)

	assert.NoError(t, err)

	assert.Equal(t, len(exploded_attrs), 4)

	assert.NotNil(t, exploded_attrs["intValue"])
	assert.NotNil(t, exploded_attrs["stringValue"])
	assert.NotNil(t, exploded_attrs["boolValue"])
	assert.NotNil(t, exploded_attrs["doubleValue"])

	assert.Equal(t, exploded_attrs["intValue"], int64(1))
	assert.Equal(t, exploded_attrs["stringValue"], "str")
	assert.Equal(t, exploded_attrs["boolValue"], true)
	assert.Equal(t, exploded_attrs["doubleValue"], 1.23)
}
