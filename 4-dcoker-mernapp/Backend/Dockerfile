# MULTI STAGE BUILD
FROM node:lts-alpine3.21 AS builder-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# PRODUCTION BUILD
FROM node:lts-alpine3.21 AS production-stage
WORKDIR /workdir
COPY --from=builder-stage /app /workdir/
EXPOSE 3000
CMD ["npm", "start"]




