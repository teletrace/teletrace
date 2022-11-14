# modeltranslator

The `modeltranslator` package translates OTLP trace data to the internal model used by the Elasticsearch exporter.

## Usage

```go
internalSpans := modeltranslator.TranslateOTLPToInternalSpans(td.(ptrace.Traces))
```
