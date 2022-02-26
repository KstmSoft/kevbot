# syntax=docker/dockerfile:1

FROM node:current-alpine3.12

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . .

CMD [ "node", "index.js" ]