# Docker Compose Deployment

## Introduction

This tutorial will guide you through the process of running Teletrace with Elastic using Docker Compose. Teletrace stores its trace data in Elasticsearch, and this tutorial will show you how to set up a complete environment with both Teletrace and Elastic running in Docker containers.

## Prerequisites

- Docker installed on your machine. You can download it from [here](https://docs.docker.com/engine/install/).
- Docker Compose installed on your machine. You can download it from [here](https://docs.docker.com/compose/install/).

<!-- prettier-ignore-start -->
## Steps

1. Create a new directory on your machine and navigate to it in a terminal or command prompt.
```sh
mkdir teletrace && cd teletrace
```

2. Create a file named `docker-compose.yml` and paste the provided docker compose configuration into the file.
```yaml
version: "3"
services:
  teletrace-api:
    ports:
      - "8080:8080"
      - "4317:4317"
      - "4318:4318"
    command: ["--config=/etc/teletrace-collector-config.yaml"]
    volumes:
      - ./teletrace-collector-config.yaml:/etc/teletrace-collector-config.yaml
    environment:
      - ES_ENDPOINT=http://elasticsearch:9200
    image: teletrace/teletrace:latest
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "localhost:8080/v1/ping"]
      interval: 60s
      timeout: 5s
      retries: 3
    networks:
      - teletrace
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
      - teletrace
    healthcheck:
      test: curl -s http://elasticsearch:9200 >/dev/null || exit 1
      interval: 3s
      timeout: 10s
      retries: 50

volumes:
  es_data:
    driver: local
networks:
  teletrace:
    internal: false
```
This YAML file defines a Docker Compose environment that contains two services, teletrace-api and elasticsearch.
    1. The teletrace-api service exposes ports 8080, 4317, and 4318, and it has a command that specifies the path to a configuration file for the Teletrace collector. The volumes section maps the local configuration file to the container path so that the configuration can be loaded by the container. The environment section sets the endpoint for Elasticsearch to http://elasticsearch:9200. The image section specifies the Docker image to use for the teletrace-api service, which is teletrace/teletrace:latest.
    2. The healthcheck section specifies a command to run to check if the container is healthy, and it is set to periodically check if the API is responding to a ping request. The networks section specifies that the teletrace network should be used, and the depends_on section specifies that the elasticsearch service should be running and healthy before the teletrace-api service starts.
    3. The elasticsearch service uses the official Elasticsearch Docker image, elasticsearch:8.4.2, and it sets the environment variables for Elasticsearch. The volumes section maps the local es_data volume to the container path, which is used to store Elasticsearch data. The expose section exposes port 9200 for external access. The healthcheck section specifies a command to run to check if the container is healthy, and it periodically checks if Elasticsearch is responding to requests. The networks section specifies that the teletrace network should be used.

3. In the same directory create a file named `teletrace-collector-config.yaml` and paste the provided configuration into the file.
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
This is a YAML configuration file for Teletrace Collector that specifies how traces are collected, processed, and exported.

4. Start the Teletrace and Elasticsearch containers using Docker Compose by running the following command:
```sh
docker-compose up -d
```

5. Verify that the containers are running by running the following command:
```sh
docker ps
```
This will show a list of running containers on your machine, and you should see the teletrace and elasticsearch containers listed.

6. Open a web browser and navigate to http://localhost:8080. This should open the Teletrace UI, where you can see the traces and spans captured by Teletrace.

7. Stop the containers by running the following command:
```sh
docker-compose down
```
This will gracefully stop the containers and remove the container resources.
<!-- prettier-ignore-end -->

## Configuration

The provided Docker Compose configuration sets up two services, teletrace-api and elasticsearch. The teletrace-api service is configured to use the teletrace-collector-config.yaml file for its configuration and to connect to the elasticsearch service for data storage. The elasticsearch service is configured with the settings specified in the compose file, including a volume for data storage and a healthcheck to ensure the service is running.

The teletrace-collector-config.yaml file contains configurations for receivers, processors, and exporters. In this configuration, the receiver is set to listen for OpenTelemetry Protocol (OTLP) data on both gRPC and HTTP protocols, the processor is set to batch the data, and the exporter is set to send data to Elasticsearch. Additionally, the service pipeline is configured to receive data from the otlp receiver, process it with the batch processor, and export it to the elasticsearch exporter.

## Troubleshooting

- If the Teletrace service is not running, check the logs for any errors with `docker-compose logs teletrace-api`.
- If you are unable to access Elasticsearch, check that the service is running and healthy by running `docker-compose ps`.
- If data is not being exported to Elasticsearch, check the configuration of the exporter and ensure the Elasticsearch endpoint is correct.
