FROM node:10

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

CMD yarn build
