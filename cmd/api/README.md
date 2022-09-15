# api

The `cmd/api` package builds the REST API used for communicating between the traces frontend and backend as executable.

## Development

- Only build-related logic should be included in this package.
- API-related logic should be imported from `pkg/api`.

```sh
go run .
curl localhost:8080/v1/ping
```

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.
