FROM  node:8-alpine as yarn-install
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual build-dependencies bash git openssh python make g++ && \
    yarn --no-cache && \
    apk del build-dependencies && \
    yarn cache clean

# Stage 1
FROM  node:8-alpine as react-build
WORKDIR /app
COPY --from=yarn-install /app/node_modules /app/node_modules
COPY . .
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
