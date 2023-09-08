#!/usr/bin/env bash

set -e

PRISM_PORT=$1
MEDIATOR_PORT=$2

MEDIATOR_PORT="${MEDIATOR_PORT}" \
PORT=${PRISM_PORT} \
docker compose \
  -p local-prism \
  -f "docker-compose.yml" \
  --env-file ../.env down -v
