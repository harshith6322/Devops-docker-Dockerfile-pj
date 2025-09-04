FROM node:lts-trixie-slim AS builder
# MAINTAINER  name harshith
LABEL author="harshith" project="react-typescript-pnpm"
WORKDIR /app
# RUN apt update && apt upgrade -y 
COPY package*.json pnpm*.yaml  ./
RUN npm install -g pnpm@latest && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build && npm cache clean --force

FROM nginx:stable-alpine3.21-perl
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
EXPOSE 80
#stop container with clean on signal
STOPSIGNAL SIGTERM 
CMD ["nginx", "-g", "daemon off;"]



