#!/usr/bin/env bash

cleanup()
{
  ./stop.sh ${PRISM_PORT} ${MEDIATOR_PORT}
  exit 0
}

if [[ -z "${CI}" ]]; then
  trap cleanup SIGINT
fi

../update_env.sh

PRISM_PORT="${PPORT:-8090}"
MEDIATOR_PORT="${MPORT:-8080}"

MEDIATOR_PORT="$MEDIATOR_PORT" \
PORT="$PRISM_PORT" \
docker compose \
  -p "local-prism" \
  -f "docker-compose.yml" \
  --env-file ../.env up -d --wait

echo
echo "Press ctrl+c to end execution"
read -r -d '' _ 
