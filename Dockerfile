# ------------------- Dev build -------------------
FROM node:10.17-alpine AS build-stage
LABEL maintainer="Denys Korniichuk (denys.korn@room4.team)"

ARG BUILD='1'

WORKDIR /app

COPY ./*.json /app/

RUN npm install

COPY ./src /app/src/

RUN if [ $BUILD = '1' ]; then \
# TODO add ability to provice "prod" mode during build
        npm run build -- --output-path=./dist/out; \
    fi

# ------------------- NginX build -------------------
FROM nginx:1.17.6-alpine

COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
