OUT_DIR ?= out
BIN_DIR := $(OUT_DIR)/bin
VERBOSE ?= false

ifneq (VERBOSE, true)
.SILENT:
endif

.PHONY: all
all: print-vars \
	backend-build backend-test backend-lint backend-all \
	frontend-install frontend-build frontend-test frontend-lint frontend-all \
	docker-build-image
test: backend-test frontend-test

.PHONY: print-vars
print-vars:
	echo "VERBOSE: $(VERBOSE)"
	echo "OUT_DIR: $(OUT_DIR)"
	echo "BIN_DIR: $(BIN_DIR)"

# backend

.PHONY: backend-test
backend-test:
	go test -v ./...

.PHONY: backend-lint
backend-lint:
	golangci-lint run --color always --sort-results ./...

.PHONY: backend-build
backend-build:
	go build -o $(BIN_DIR)/oss-tracing ./cmd/all-in-one/main.go

backend-all: backend-lint backend-test backend-build

# frontend

.PHONY: frontend-install
# install dependencies
frontend-install:
	cd ./web; yarn install

.PHONY: frontend-lint
frontend-lint: frontend-install
	cd ./web; yarn lint

.PHONY: frontend-eslint-fix
frontend-eslint-fix: frontend-install
	cd ./web; yarn run eslint --fix

.PHONY: frontend-test
frontend-test: frontend-install
	cd ./web; yarn test -- --watchAll=false --passWithNoTests

.PHONY: frontend-build
frontend-build: frontend-install
	 cd ./web; BUILD_PATH=../$(BIN_DIR)/web yarn build

.PHONY: fronted-all
frontend-all: frontend-install frontend-lint frontend-test frontend-build

# docker

.PHONY: docker-build-image
docker-build-image:
	docker build -t "epsagon/oss-tracing" cmd/all-in-one
