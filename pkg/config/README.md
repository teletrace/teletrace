# config

The config package handles config related operations for the entire application.  
Its main purpose is loading config options from multiple sources (e.g. config file, env variables).

## Supported Options

```
DEBUG - (default: true) Whether to run in debug (development) mode for extra debug info
API_PORT - (default: 8080) Port on which the API server shout run
```

## Config Sources

Config options can be loaded from multiple sources:

- Environment variables
- `config.yaml` - Should be placed inside the working directory (e.g. `cmd/api-build`).

Config sources are prioritized:  
default values (lowest priority) < config file < env variables (highest priority).
