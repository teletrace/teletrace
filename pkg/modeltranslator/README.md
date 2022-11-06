# modeltranslator

The `modeltranslator` package translates OTLP trace data to the internal model used by the collector.

## Usage

```go
internalSpans := modeltranslator.TranslateOTLPToInternalModel(td.(ptrace.Traces))
```
