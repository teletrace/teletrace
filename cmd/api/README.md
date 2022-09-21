# api

The `cmd/api` package builds the REST API used for communicating between the traces frontend and backend.

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.

## Development

```sh
go run .
```

## Usage Example

```sh
curl localhost:8080/v1/ping
```
