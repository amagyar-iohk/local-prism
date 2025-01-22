#!/usr/bin/env bash

cleanup()
{
  ./stop.sh
  exit 0
}

if [[ -z "${CI}" ]]; then
  trap cleanup SIGINT
fi

docker compose \
  -p "${COMPOSE_NAME}" \
  -f "docker-compose.yml" \
  --env-file ../.env up -d --wait

echo
echo "Press ctrl+c to end execution"
read -r -d '' _ 
