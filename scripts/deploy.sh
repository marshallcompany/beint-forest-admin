#!/usr/bin/env bash

if [ -z "$1" ]
  then
    read -r -p "Environment: " input
  else
    input="$1"
  fi

(
  cd _deployment/$input || cd ../_deployment/$input || (echo "environment not found" && exit)

  ./deploy.sh
)
