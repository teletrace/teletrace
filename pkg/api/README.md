# api

The `api` package defines the REST API used for communicating between the traces frontend and backend.\
[Gin](https://github.com/gin-gonic/gin) is used as the API HTTP web framework.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
api := api.NewAPI(logger, cfg)

// Starts the API server and blocks the goroutine
if err := api.Start(); err != nil {
    // API server stopped due to an error
}
```
