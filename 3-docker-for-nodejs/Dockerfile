# ---------- builder ----------
FROM node:jod-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production

# ---------- runtime ----------
FROM node:jod-alpine3.22 AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# install pm2-runtime as a dependency if you want process management (alternatively add it to package.json)
RUN npm i pm2 -g --no-audit --no-fund

COPY --from=builder /app /app

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# use pm2-runtime to allow proper signal handling in docker/k8s
CMD ["pm2-runtime", "start", "server.js", "-i", "2"]
# CMD ["node", "server.js"]
