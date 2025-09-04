FROM node:lts-trixie-slim AS builder
LABEL author="harshith" version="1.0.0" detials="this an expense-tracker angular project"
# USER root
# RUN apt update && apt upgrade
WORKDIR /app
COPY package*.json angular.json ./
RUN npm install --frozen-lockfile
# RUN npm install --omit=dev
# RUN npm ci
COPY . .
RUN npm run build && npm cache clean --force

FROM nginx:stable-alpine3.21-perl AS prod
RUN rm -rf /usr/share/ngnix/html/*
COPY --from=builder --chown=nginx:nginx /app/dist/expense-tracker /usr/share/nginx/html
EXPOSE 80
#stop container with clean on signal
STOPSIGNAL SIGTERM 
CMD [ "nginx", "-g", "daemon off;" ]






