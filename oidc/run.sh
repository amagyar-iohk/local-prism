#!/usr/bin/env bash

cleanup()
{
  ./stop.sh ${PRISM_PORT} ${MEDIATOR_PORT} ${DIDCOMM_PORT} ${COMPOSE_NAME} ${AUTHSERVER_PORT} ${DOCKERHOST}
  exit 0
}

if [[ -z "${CI}" ]]; then
  trap cleanup SIGINT
fi

DOCKERHOST=$(ip route show default | awk '/default/ {print $9}')
PRISM_PORT="${PPORT:-8090}"
MEDIATOR_PORT="${MPORT:-8080}"
DIDCOMM_PORT="${DCPORT:-8081}"
AUTHSERVER_PORT="9981"
COMPOSE_NAME="local-prism-$RANDOM"

DOCKERHOST="$DOCKERHOST" \
AUTHSERVER_PORT="$AUTHSERVER_PORT" \
MEDIATOR_PORT="$MEDIATOR_PORT" \
PORT="$PRISM_PORT" \
DIDCOMM_PORT="$DIDCOMM_PORT" \
COMPOSE_NAME="$COMPOSE_NAME" \
docker compose \
  -p "${COMPOSE_NAME}" \
  -f "docker-compose.yml" \
  --env-file ../.env up -d --wait

echo
echo "Press ctrl+c to end execution"
read -r -d '' _ 
