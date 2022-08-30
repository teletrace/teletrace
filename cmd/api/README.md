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
