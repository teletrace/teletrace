# General Information

An exporter is how data gets sent to different systems/back-ends. In Lupa, exporters are used mainly to write data to a storage.
Opentelemetry traces (in [ptrace](https://github.com/open-telemetry/opentelemetry-collector/blob/main/pdata/ptrace/traces.go) format) are translated to a span model called [InternalSpan](https://github.com/epsagon/lupa/blob/main/model/internalspan/v1/internal_span.go) and stored in storage.

Available trace exporters (sorted alphabetically):

- [Elasticsearch](elasticexporter/README.md)
- [SQLite](sqlliteexporter/README.md)

# Configure exporters

Lupa exporters work best with a batch processor configured
// add configs once unified configuration is discussed
