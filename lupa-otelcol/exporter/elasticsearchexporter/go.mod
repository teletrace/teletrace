module github.com/epsagon/lupa/lupa-otelcol/exporter/elasticsearchexporter

go 1.19

require (
	github.com/elastic/go-elasticsearch/v8 v8.4.0
	github.com/epsagon/lupa/lupa-otelcol/internal/modeltranslator v0.0.0-00010101000000-000000000000
	github.com/epsagon/lupa/model v0.0.0-20221116145245-cd3200414333
	go.opentelemetry.io/collector v0.64.1
	go.opentelemetry.io/collector/pdata v0.66.0
	go.uber.org/multierr v1.8.0
	go.uber.org/zap v1.23.0
)

require (
	github.com/cenkalti/backoff/v4 v4.1.3 // indirect
	github.com/elastic/elastic-transport-go/v8 v8.1.0 // indirect
	github.com/gogo/protobuf v1.3.2 // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/knadh/koanf v1.4.4 // indirect
	github.com/mitchellh/copystructure v1.2.0 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/mitchellh/reflectwalk v1.0.2 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	go.opencensus.io v0.24.0 // indirect
	go.opentelemetry.io/otel v1.11.1 // indirect
	go.opentelemetry.io/otel/metric v0.33.0 // indirect
	go.opentelemetry.io/otel/trace v1.11.1 // indirect
	go.uber.org/atomic v1.10.0 // indirect
	golang.org/x/net v0.0.0-20220722155237-a158d28d115b // indirect
	golang.org/x/sys v0.2.0 // indirect
	golang.org/x/text v0.4.0 // indirect
	google.golang.org/genproto v0.0.0-20211208223120-3a66f561d7aa // indirect
	google.golang.org/grpc v1.51.0 // indirect
	google.golang.org/protobuf v1.28.1 // indirect
)

replace github.com/epsagon/lupa/model => ../../../model

replace github.com/epsagon/lupa/lupa-otelcol/internal/modeltranslator => ../../internal/modeltranslator
