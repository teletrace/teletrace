# all-in-one demo

Relays on the [official OTel collector demo](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/examples/demo).

```mermaid
graph TD;
  demo_server-->otel_collector;
  demo_client-->otel_collector;
  demo_client-->demo_server;
  otel_collector-->lupa_otel_collector;
  lupa_otel_collector-->elasticsearch;
  kibana-->elasticsearch;
  API-->elasticsearch;
  UI-->API;
```

## Usage

```sh
docker compose up -d
```

- UI - http://localhost:8080/
- API - http://localhost:8080/v1/ping
- Kibana (for accessing ingested traces) - http://localhost:5601/

## Continuous Development Usage

Run the demo environment using Tilt.dev to easily develop while demo is up.

- To install tilt:

```sh
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
```

- To run:

```sh
tilt up
```

- UI - http://localhost:8080/
- API - http://localhost:8080/v1/ping
- Kibana (for accessing ingested traces) - http://localhost:5601/
