#!/usr/bin/env bash

set -e

PRISM_PORT=$1
MEDIATOR_PORT=$2
DIDCOMM_PORT=$3
COMPOSE_NAME=$4

MEDIATOR_PORT="${MEDIATOR_PORT}" \
PORT=${PRISM_PORT} \
DIDCOMM_PORT=${DIDCOMM_PORT} \
COMPOSE_NAME=${COMPOSE_NAME} \
docker compose \
  -p "$COMPOSE_NAME" \
  -f "docker-compose.yml" \
  --env-file ../.env down -v
