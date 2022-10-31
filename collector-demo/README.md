# Collector Demo

Simple collector ingestion demo for testing purposes.\
Relays on the [official OTel collector demo](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/examples/demo).

![collector architecture overview](./collector-demo.jpg)

## Usage

```sh
docker compose up -d
```

Use Kibana (http://localhost:5601/) to access the ingested spans.
