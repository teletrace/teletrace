# config

The `config` package handles config related operations for the entire application.
Its main purpose is loading config options from multiple sources (default values/config file/env variables).

## Supported Options

```
| Option                               | Default       | Description                                                                     |
| ------------------------------------ | ------------- | ------------------------------------------------------------------------------- |
| DEBUG                                | true          | Whether to run in debug mode for extra debug info                               |
| API_PORT                             | 8080          | API server port                                                                 |
| GRPC_ENDPOINT                        | 0.0.0.0:4317  | OTLP/gRPC collector receiver port                                               |
| HTTP_ENDPOINT                        | 0.0.0.0:4318  | OTLP/HTTP collector receiver port                                               |
| OTLP_QUEUE_SIZE                      | 1000          | Maximum capacity of OTLP requests the queue can hold                            |
| OTLP_QUEUE_WORKERS_COUNT             | 1             | Number of workers to run and consume from the OTLP queue                        |
| OTLP_QUEUE_SHUTDOWN_TIMEOUT_SECONDS  | 60            | Seconds to wait before forcefully stopping the OTLP queue consumers             |
| SPANS_QUEUE_SIZE                     | 1000          | Maximum capacity of translated spans requests the queue can hold                |
| SPANS_QUEUE_WORKERS_COUNT            | 10            | Number of workers to run and consume from the translated spans queue            |
| SPANS_QUEUE_SHUTDOWN_TIMEOUT_SECONDS | 120           | Seconds to wait before forcefully stopping the translated spans queue consumers |
```

## Config Sources

Config options can be loaded from multiple sources:

- Default values
- `config.yaml` - Should be placed inside the working directory (e.g. `cmd/all-in-one`).
- Environment variables

Config sources are prioritized:
default values (lowest priority) < config file < env variables (highest priority).

## Usage

```go
cfg, err := config.NewConfig()
if err != nil {
    // Failed to initialize config
}

// Config access example
if cfg.Debug {
    // Debug is true
}
```
