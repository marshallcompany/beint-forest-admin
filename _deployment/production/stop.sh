#!/usr/bin/env bash

set -e

PROJECT_NAME='beint_web_app-prod'

docker-compose --project-name $PROJECT_NAME down
