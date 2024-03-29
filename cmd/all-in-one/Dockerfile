FROM  golang:1.19-alpine3.16 as backend-builder

RUN apk add build-base

WORKDIR /app

# COPY relevant files and build
COPY go.mod .
COPY go.sum .
COPY cmd/all-in-one/ ./cmd/all-in-one/
COPY teletrace-otelcol/ ./teletrace-otelcol
COPY model/ ./model
COPY pkg ./pkg
COPY plugin ./plugin

RUN go build -o /app/build/bin ./cmd/all-in-one


FROM node:18-alpine3.16 AS ui-builder
ARG BUILD_INFO

WORKDIR /app

# Cache and Install dependencies
COPY web/package.json .
COPY web/yarn.lock .
RUN yarn install --network-timeout 1000000

# Copy app files
COPY web/ .

# Build the app
ENV REACT_APP_API_URL="/"
ENV REACT_APP_BUILD_INFO="${BUILD_INFO}"
RUN yarn build


FROM alpine:3.16
WORKDIR /app

COPY --from=backend-builder /app/build/bin /app/api/bin
COPY --from=ui-builder /app/build /app/web/build

# Inform that the image created by this Dockerfile
# will listen on this port
EXPOSE 8080
ENTRYPOINT [ "/app/api/bin" ]
