module github.com/epsagon/lupa/lupa-otelcol/exporter/postgresqlexporter

go 1.19

require (
	github.com/golang-migrate/migrate/v4 v4.15.2
    github.com/lib/pq v1.10.7
	go.opentelemetry.io/collector v0.64.1
	go.opentelemetry.io/collector/pdata v0.64.1
	go.uber.org/zap v1.23.0
)