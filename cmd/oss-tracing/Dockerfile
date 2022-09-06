FROM golang:1.19-alpine3.16 as builder

WORKDIR /app

# COPY go.mod, go.sum and download the dependencies
COPY go.* ./
RUN go mod download

# COPY All things inside the project and build
COPY . .
RUN go build -o /app/build/bin ./cmd/oss-tracing

FROM alpine:3.16
COPY --from=builder /app/build/bin /app/build/bin

# Inform that the image created by this Dockerfile
# will listen on this port 
EXPOSE 8080
ENTRYPOINT [ "/app/build/bin" ]
