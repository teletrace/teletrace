# all-in-one

The `all-in-one` package is responsible for building all of the application components as a single executable.

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.

## Development

```sh
go run .
```

## Usage Examples

- [API](../../cmd/api/README.md#usage-example)
- [Collector](../../cmd/collector/README.md#usage-example)

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.

## Run With Docker

### Prerequisite

Download and install docker in your machine from [here](https://docs.docker.com/get-docker/)

### How to start

The examples assumes that you are in the root folder

using docker-compose:

```sh
docker-compose -f deploy/docker-compose/docker-compose.yml up
```

alternatively, using docker CLI:

```sh
docker build -f cmd/all-in-one/Dockerfile -t oss-tracing:latest .
docker run -p 8080:8080 -p 4317:4317 -p 4318:4318 oss-tracing:latest
```

In case you want to run docker file with environment variables

```sh
docker run -p 9090:9090 -e API_PORT=9090 -e DEBUG=false oss-tracing:latest
```
