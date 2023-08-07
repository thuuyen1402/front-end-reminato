# Stage 1
FROM node:16.13.1 AS installation

WORKDIR /base

COPY . /base

RUN npm install
RUN npm install -g serve


FROM installation as build
RUN npm run build

