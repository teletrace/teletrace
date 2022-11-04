# logs

The `logs` package provides logging related capabilities.\
[Zap](https://github.com/uber-go/zap) is used as the project logger.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
logger, err := logs.NewLogger(cfg)
if err != nil {
    // failed to initialize logger
}
defer logs.FlushBufferedLogs(logger)
```
