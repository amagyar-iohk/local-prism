#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

set -a
source "./.env"
set +a

NEW_PRISM_AGENT_VERSION=$(github get-latest-package-version --package prism-agent --package-type container)
NEW_PRISM_NODE_VERSION=$(github get-latest-package-version --package prism-node --package-type container)
NEW_ATALA_MEDIATOR_VERSION=$(github get-latest-package-version --package atala-prism-mediator --package-type container)

sed -i.bak "s/PRISM_AGENT_VERSION=.*/PRISM_AGENT_VERSION=${NEW_PRISM_AGENT_VERSION}/" .env
sed -i.bak "s/PRISM_NODE_VERSION=.*/PRISM_NODE_VERSION=${NEW_PRISM_NODE_VERSION}/" .env
sed -i.bak "s/ATALA_MEDIATOR_VERSION=.*/ATALA_MEDIATOR_VERSION=${NEW_ATALA_MEDIATOR_VERSION}/" .env

rm -f .env.bak
