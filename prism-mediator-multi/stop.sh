#!/usr/bin/env bash

set -e

COMPOSE_NAME=$1

COMPOSE_NAME=${COMPOSE_NAME} \
docker compose \
  -p "$COMPOSE_NAME" \
  -f "docker-compose.yml" \
  --env-file ../.env down -v
