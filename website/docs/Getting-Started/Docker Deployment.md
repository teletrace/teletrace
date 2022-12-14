Docker compose is the easiest and most recommended way of hosting Lupa.
##Requirements
* [Docker](https://docs.docker.com/engine/install/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [Git](https://git-scm.com/downloads)

### Standalone Docker
Lupa offers a standalone docker image that deploys an entire Lupa stack ready to operate.
This is recommended for experimentation and low-scale deployments.
To use the standalone docker, first, you have to clone the project:

	git clone https://github.com/epsagon/lupa.git

Using docker-compose:

	docker-compose -f deploy/docker-compose/docker-compose.yml up

Alternatively, using docker CLI:

	docker build -f cmd/all-in-one/Dockerfile -t oss-tracing:latest .
	docker run \
	    -v $(pwd)/lupa-otelcol/config/default-config.yaml:/etc/config.yaml \
	    -p 8080:8080 \
	    -p 4317:4317 \
	    -p 4318:4318 \
	    oss-tracing:latest \
	    --config /etc/config.yaml