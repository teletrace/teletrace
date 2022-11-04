# logs

The `logs` package provides logging related capabilities.\
[Zap](https://github.com/uber-go/zap) is used as the project logger.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
logger, err := logs.NewLogger(cfg)
if err != nil {
    // Failed to initialize logger
}

// Flushes any buffered logs before the process exists
defer logs.FlushBufferedLogs(logger)

// Error logging example
logger.Error("Failed to do some operation", zap.Error(err))
```
