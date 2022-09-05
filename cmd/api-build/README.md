# api-build

The `api-build` package builds the REST API for communicating between the traces frontend and backend.

## Development

- Only build-related logic should be included in this package.
- API-related logic should be imported from `pkg/api`.

```sh
go run .
curl localhost:8080/v1/ping
```

## Configuration

This package reads [config options](../../pkg/config/README.md) from `pkg/config`.

## Run With Docker

### Prerequisite

Download and install docker in your machine from [here](https://docs.docker.com/get-docker/)

### How to start

The examples assumes that you are in the root folder

```sh
docker build -f cmd/api/Dockerfile -t oss-tracing:latest .
docker run -p 8080:8080 oss-tracing:latest
```

In case you want to run docker file with environment variables

```sh
docker run -p 9090:9090 -e PORT=9090 -e DEBUG=false oss-tracing:latest
```
