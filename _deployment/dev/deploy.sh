#!/usr/bin/env bash

../.common/add-env-file-if-not-exists.sh

set -e

PROJECT_NAME='beint_web_app-dev'

docker-compose --project-name $PROJECT_NAME kill
docker-compose --project-name $PROJECT_NAME rm -f
docker-compose --project-name $PROJECT_NAME pull
docker-compose --project-name $PROJECT_NAME up -d --build
