#!/usr/bin/env bash

set -e

PROJECT_NAME='beint_web_app-test'

docker-compose --project-name $PROJECT_NAME down
