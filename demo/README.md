# all-in-one demo

Relays on the [official OTel collector demo](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/examples/demo).

```mermaid
graph TD;
  demo_server-->otel_collector;
  demo_client-->otel_collector;
  otel_collector-->lupa_otel_collector;
  lupa_otel_collector-->elasticsearch;
  kibana-->elasticsearch;
```

## Usage

```sh
docker compose up -d
```

- UI - http://localhost:8080/
- API - http://localhost:8080/v1/ping
- Kibana (for accessing ingested traces) - http://localhost:5601/
