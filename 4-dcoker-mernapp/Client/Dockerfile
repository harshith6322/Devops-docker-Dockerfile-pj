#MUTLI STAGE BUILD
FROM node:lts-alpine3.21 AS builder-stage
WORKDIR /App
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
# EXPOSE 5173
# CMD [ "npm", "run", "dev" ]


#PRODUCTION BUILD
FROM nginx:alpine AS producton-stage
COPY --from=builder-stage /App/dist /usr/share/nginx/html
EXPOSE 80
# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]






# FROM node:22.15.0-slim
# WORKDIR /apps
# COPY package*.json /apps
# RUN npm install
# COPY . . 
# EXPOSE 5173
# CMD [ "npm", "run", "dev" ]


