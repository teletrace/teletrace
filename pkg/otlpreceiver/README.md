# otlpreceiver

The `otlpreceiver` package sets up HTTP and gRPC servers for receiving OTLP communication.\
Accepts a callback for consuming the incoming traces.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
otlpReceiver, err := otlpreceiver.NewOtlpReceiver(cfg, logger, tracesProcessor)
if err != nil {
    // failed to initialize receiver
}

if err := c.otlpReceiver.Start(); err != nil {
    // failed to start receiver
}

if err := c.otlpReceiver.Shutdown(); err != nil {
    // Failed to gracefully shut down receiver
}
```
