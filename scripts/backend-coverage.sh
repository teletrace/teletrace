#!/usr/bin/env bash

# Generates module and package level coverage report for given Go modules.
# Receives two parameters: the project root directory and an array of Go module directories.
# Outputs a coverage (.out) file and a correspondent .html file for each Go module to $ROOT_DIR/coverage.

set -e

ROOT_DIR=$1
shift
GO_MODULES=("$@")

mkdir -p coverage
rm -rf coverage/*

for index in "${!GO_MODULES[@]}"; do
    module_dir="${GO_MODULES[index]}"
    module_name=$(basename $module_dir)
    coverage_filename=$index-$module_name

    cd $module_dir
    mkdir -p coverage
    rm -rf coverage/*

    echo "Package coverage for module \"$module_name\" ($module_dir):"
    echo "--------------"
    go test -coverprofile=coverage/$coverage_filename.out ./...
    echo "--------------"

    module_packages=$(go list ./...)
    go test -coverpkg=$(echo "$module_packages" | paste -sd, -) -coverprofile=coverage/$coverage_filename.out ./... >/dev/null
    module_coverage=$(go tool cover -func=coverage/$coverage_filename.out | awk 'END {print $3}')
    echo "Total module coverage: $module_coverage"

    echo -e "Generating coverage html file (coverage/$coverage_filename.html)...\n"
    go tool cover -html=coverage/$coverage_filename.out -o coverage/$coverage_filename.html

    if [ $module_dir != $ROOT_DIR ]; then
        mv coverage/* $ROOT_DIR/coverage/
        rm -rf coverage
    fi
done
