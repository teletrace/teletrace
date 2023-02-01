#!/usr/bin/env bash

# Generates a coverage (.out) file and a correspondent .html file for each Go module.
# Receives two arguments: the project root directory and an array of Go module directories.
# The final destination directory for all the generated files is $ROOT_DIR/coverage.

set -e

ROOT_DIR=$1
shift
GO_MODULES=("$@")

mkdir -p coverage
rm -rf coverage/*

for index in "${!GO_MODULES[@]}"; do
    module_dir="${GO_MODULES[index]}"
    coverage_filename=$index-$(basename $module_dir)
    cd $module_dir
    mkdir -p coverage
    rm -rf coverage/*
    go test -coverprofile=coverage/$coverage_filename.out ./...
    go tool cover -html=coverage/$coverage_filename.out -o coverage/$coverage_filename.html
    if [ $module_dir != $ROOT_DIR ]; then
        mv coverage/* $ROOT_DIR/coverage/
        rm -rf coverage
    fi
done
