FROM --platform=${BUILDPLATFORM:-linux/amd64} golang:1.19-alpine3.16 as backend-builder

WORKDIR /app

# COPY All things inside the project and build
COPY . .
RUN GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -o /app/build/bin ./cmd/all-in-one


FROM node:18-alpine3.16 AS ui-builder

WORKDIR /app

# Cache and Install dependencies
COPY web/package.json .
COPY web/yarn.lock .
RUN yarn install --network-timeout 1000000

# Copy app files
COPY web/ .

# Build the app
RUN yarn build


FROM alpine:3.16
WORKDIR /app

COPY --from=backend-builder /app/build/bin /app/api/bin
COPY --from=ui-builder /app/build /app/web/build

# Inform that the image created by this Dockerfile
# will listen on this port
EXPOSE 8080
ENTRYPOINT [ "/app/api/bin" ]
