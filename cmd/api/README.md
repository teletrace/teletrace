# API

[Gin](https://github.com/gin-gonic/gin) is used as the API HTTP web framework

## Development

- Only core server logic should be included in this directory
- Specific services related logic should be imported from the pkg/internal directories

```sh
go run .
curl localhost:8080/v1/ping
```
