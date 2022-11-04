# api

The `api` package defines the REST API used for communicating between the traces frontend and backend.\
[Gin](https://github.com/gin-gonic/gin) is used as the API HTTP web framework.

## Configuration

This package is using [config options](../config/README.md) provided by `pkg/config`.

## Usage

```go
cfg, _ := config.NewConfig()
logger, _ := logs.NewLogger(cfg)

api := api.NewAPI(logger, cfg)

// api.Start() blocks the goroutine unless an error happens
if err := api.Start(); err != nil {
    logger.Fatal("API server crashed", zap.Error(err))
}
```
