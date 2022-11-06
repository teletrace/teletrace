# modeltranslator

The `modeltranslator` package translates OTLP trace data to the internal model used throughout the project.

## Usage

```go
internalSpans := modeltranslator.TranslateOTLPToInternalModel(td.(ptrace.Traces))
```
