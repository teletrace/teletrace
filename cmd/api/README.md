# API

REST API for communicating between the traces frontend and backend.  
[Gin](https://github.com/gin-gonic/gin) is used as the API HTTP web framework.

## Development

- Only core server logic should be included in this directory.
- Specific services related logic should be imported from the `pkg`/`internal` directories.

```sh
go run .
curl localhost:8080/v1/ping
```

## Configuration

- Changing the default API config is possible by using environment variables.
- Environment variables can also be defined in a file named `api.yaml` which should be placed inside the `cmd/api` directory.
- Env variable sources are prioritized: default values (lowest priority) < config env file < env variables (highest priority).

Supported environment variables:

```
PORT - (default: 8080) Port on which the API server should run
DEBUG - (default: true) Whether to run in debug (development) mode for extra debug info
```

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