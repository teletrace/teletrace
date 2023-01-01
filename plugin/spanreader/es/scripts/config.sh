#!/bin/bash

# use defaults
if [[ -z "${USERNAME}" ]]; then
  USERNAME="elastic"
fi

if [[ -z "${PASSWORD}" ]]; then
  PASSWORD=""
fi

if [[ -z "${HOST}" ]]; then
  HOST="http://localhost"
fi

if [[ -z "${PORT}" ]]; then
  PORT="9200"
fi

if [[ -z "${TEMPLATE_NAME}" ]]; then
  TEMPLATE_NAME="lupa-index-template"
fi

if [[ -z "${LUPA_INDEX}" ]]; then
  LUPA_INDEX="lupa-traces"
fi

curl \
    -u $USERNAME:$PASSWORD -XPUT \
    $HOST:$PORT"/_index_template/"$TEMPLATE_NAME \
    -H 'Content-Type: application/json' \
    -d "{\"index_patterns\": [\"$LUPA_INDEX\"], \"template\": {\"mappings\": {\"_source\": {\"enabled\": true}, \"properties\": {\"span.startTimeUnixNano\": {\"type\": \"date_nanos\", \"format\": \"strict_date_optional_time_nanos\"}, \"span.endTimeUnixNano\": {\"type\": \"date_nanos\", \"format\": \"strict_date_optional_time_nanos\"}}}}, \"priority\": 500, \"version\": 3, \"_meta\": {\"description\": \"Lupa traces index template\"}}"
