# collector

The `collector` package is responsible for building the trace collection components as a single executable.  
Traces in OTLP format can be received in both gRPC (default port: 4317) and HTTP (default port: 4318).

## Development

```sh
go run .
```

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.
