# otlpreceiver

The `otlpreceiver` package sets up HTTP and gRPC servers for receiving OTLP communication.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
// Initializes the receiver with a tracesProcessor callback for consuming traces
otlpReceiver, err := otlpreceiver.NewOtlpReceiver(cfg, logger, tracesProcessor)
if err != nil {
    // Failed to initialize receiver
}

// Starts the receiver, runs in the background
if err := c.otlpReceiver.Start(); err != nil {
    // Failed to start receiver
}

// Goroutine must be blocked after Start(), as it is a non-blocking call

// Gracefully shuts down the receiver
if err := c.otlpReceiver.Shutdown(); err != nil {
    // Failed to gracefully shut down receiver
}
```
