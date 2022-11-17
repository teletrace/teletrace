# all-in-one demo

Relays on the [official OTel collector demo](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/examples/demo).

```mermaid
graph TD;
  demo_server-->otel_collector;
  demo_client-->otel_collector;
  otel_collector-->lupa_otel_collector;
  lupa_otel_collector-->elasticsearch;
  elasticsearch-->kibana;
```

## Usage

```sh
docker compose up -d
```

- UI is available at http://localhost:8080/
- Use Kibana (http://localhost:5601/) to access the ingested spans.
