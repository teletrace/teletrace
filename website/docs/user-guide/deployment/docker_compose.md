# Docker Compose Deployment

This guide will walk you through the process of setting up Lupa using the provided Docker Compose configuration.

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed on your machine.

## Steps

- Create a file named `docker-compose.yml` and paste the provided docker compose configuration into the file.

```yaml
version: "3"
services:
  lupa-api:
    ports:
      - "8080:8080"
      - "4317:4317"
      - "4318:4318"
    command: ["--config=/etc/lupa-collector-config.yaml"]
    volumes:
      - ./lupa-collector-config.yaml:/etc/lupa-collector-config.yaml
    environment:
      - ES_ENDPOINT=http://elasticsearch:9200
    image: teletrace/teletrace:v0.5
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "localhost:8080/v1/ping"]
      interval: 60s
      timeout: 5s
      retries: 3
    networks:
      - lupa
    depends_on:
      elasticsearch:
        condition: service_healthy

  elasticsearch:
    image: elasticsearch:8.4.2
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
      - xpack.security.enabled=false
    volumes:
      - es_data:/usr/share/elasticsearch/data
    expose:
      - "9200"
    networks:
      - lupa
    healthcheck:
      test: curl -s http://elasticsearch:9200 >/dev/null || exit 1
      interval: 3s
      timeout: 10s
      retries: 50

volumes:
  es_data:
    driver: local
networks:
  lupa:
    internal: false
```

- In the same directory create a file named `lupa-collector-config.yaml` and paste the provided configuration into the file.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  elasticsearch:
    endpoints: ["http://elasticsearch:9200/"]

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [elasticsearch]
```

- In the terminal, navigate to the directory containing the Docker Compose configuration and run the command `docker-compose up -d`. This will start the Lupa service, as well as an Elasticsearch instance.
- Lupa will be running on port 8080 and can be accessed via http://localhost:8080/. You can also access Elasticsearch on port 9200 via http://localhost:9200/.

## Configuration

The provided Docker Compose configuration sets up two services, lupa-api and elasticsearch. The lupa-api service is configured to use the lupa-collector-config.yaml file for its configuration and to connect to the elasticsearch service for data storage. The elasticsearch service is configured with the settings specified in the compose file, including a volume for data storage and a healthcheck to ensure the service is running.

The lupa-collector-config.yaml file contains configurations for receivers, processors, and exporters. In this configuration, the receiver is set to listen for OpenTelemetry Protocol (OTLP) data on both gRPC and HTTP protocols, the processor is set to batch the data, and the exporter is set to send data to Elasticsearch. Additionally, the service pipeline is configured to receive data from the otlp receiver, process it with the batch processor, and export it to the elasticsearch exporter.

## Troubleshooting

- If the Lupa service is not running, check the logs for any errors with `docker-compose logs lupa-api`.
- If you are unable to access Elasticsearch, check that the service is running and healthy by running `docker-compose ps`.
- If data is not being exported to Elasticsearch, check the configuration of the exporter and ensure the Elasticsearch endpoint is correct.
