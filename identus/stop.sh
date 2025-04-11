#!/usr/bin/env bash

set -e

docker compose \
  -p "$COMPOSE_NAME" \
  -f "docker-compose.yml" \
  --env-file ../.env down
