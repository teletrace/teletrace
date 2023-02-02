ROOT :=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
WEB_ROOT := $(ROOT)/web
SILENT ?= true

OUT_DIR ?= $(ROOT)/out
BIN_DIR := $(OUT_DIR)/bin

# Absolute path list of all the nested Go modules directories within the project
GO_MODULES := $(shell find . -type f -name "go.mod" -exec dirname {} \; | xargs realpath)

ifneq ($(SILENT), false)
.SILENT:
endif

.PHONY: lint lint-fix test
lint: frontend-lint backend-lint
lint-fix: frontend-lint-fix backend-lint-fix
test: frontend-test backend-test

# frontend targets
.PHONY: \
	frontend-install \
	frontend-lint \
	frontend-lint-fix \
	frontend-test \
	frontend-build

frontend-install:
	cd $(WEB_ROOT); yarn install

frontend-lint: frontend-install
	cd $(WEB_ROOT); yarn lint

frontend-lint-fix: frontend-install
	cd $(WEB_ROOT); yarn lint --fix

frontend-test: frontend-install
	cd $(WEB_ROOT); yarn test --watchAll=false --passWithNoTests

frontend-build: frontend-install
	cd $(WEB_ROOT); BUILD_PATH=$(BIN_DIR)/web yarn build


# backend targets
.PHONY: \
	backend-lint \
	backend-lint-fix \
	backend-test

backend-lint:
	golangci-lint run --sort-results ./...

backend-lint-fix:
	golangci-lint run --sort-results --fix ./...

backend-test:
	set -e; \
	for module in $(GO_MODULES); do \
		cd $${module} && \
		go test -v ./...; \
	done;

.PHONY: backend-coverage
backend-coverage:
	./scripts/backend-coverage.sh ${ROOT} ${GO_MODULES}

.PHONY: all-in-one
all-in-one:
	docker build --build-arg BUILD_INFO=$(git describe --tags) -f $(ROOT)/cmd/all-in-one/Dockerfile -t lupa-aio:latest .

.PHONY: update-license-headers
update-license-headers: bin/license-header-checker
	bin/license-header-checker -v -a -r -i node_modules,web/src/features/trace/components/TraceTimeline,deploy/demo,tests/e2e/playwright/playwright.config.ts,lupa-otelcol/exporter/elasticsearchexporter/trace_exporter.go,lupa-otelcol/exporter/elasticsearchexporter/writer.go,web/src/components/Elements/BasicElements/Accordion.stories.tsx,web/src/components/Elements/BasicElements/Autocomplete.stories.tsx,web/src/components/Elements/BasicElements/Dialog.stories.tsx,web/src/components/Elements/BasicElements/Drawer.stories.tsx,web/src/components/Elements/BasicElements/List.stories.tsx,web/src/components/Elements/BasicElements/Snackbar.stories.tsx,web/src/components/Elements/BasicElements/TextField.stories.tsx,web/src/components/Elements/BasicElements/ToggleButtonGroup.stories.tsx,web/src/components/Elements/BasicElements/Tooltip.stories.tsx,web/src/components/Elements/BasicElements/Typography.stories.tsx .github/license_header.txt . ts tsx js go css

bin/license-header-checker:
	curl -s https://raw.githubusercontent.com/lluissm/license-header-checker/master/install.sh | bash

.PHONY: list
list:
	@LC_ALL=C $(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | \
		awk -v RS= -F: '/(^|\n)# Files(\n|$$)/,/(^|\n)# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | \
		sort | \
		egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
