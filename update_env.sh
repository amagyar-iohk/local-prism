#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

set -a
source "./.env"
set +a

NEW_IRIS_SERVICE_VERSION=$(github get-latest-package-version --package iris-service --package-type container)
NEW_PRISM_AGENT_VERSION=$(github get-latest-package-version --package prism-agent --package-type container)
NEW_ENTERPRISE_SERVICE_VERSION=$(github get-latest-package-version --package prism-enterprise-services --package-type container)
NEW_MANAGE_FRONTEND_VERSION=$(github get-latest-package-version --package prism-manage-frontend --package-type container)

sed -i.bak "s/IRIS_SERVICE_VERSION=.*/IRIS_SERVICE_VERSION=${NEW_IRIS_SERVICE_VERSION}/" .env
sed -i.bak "s/PRISM_AGENT_VERSION=.*/PRISM_AGENT_VERSION=${NEW_PRISM_AGENT_VERSION}/" .env
sed -i.bak "s/ENTERPRISE_SERVICE_VERSION=.*/ENTERPRISE_SERVICE_VERSION=${NEW_ENTERPRISE_SERVICE_VERSION}/" .env
sed -i.bak "s/MANAGE_FRONTEND_VERSION=.*/MANAGE_FRONTEND_VERSION=${NEW_MANAGE_FRONTEND_VERSION}/" .env

rm -f .env.bak
