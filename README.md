# 0x-launch-kit-frontend

[![CircleCI](https://circleci.com/gh/0xProject/0x-launch-kit-frontend.svg?style=svg)](https://circleci.com/gh/0xProject/0x-launch-kit-frontend)
[![dependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend)
[![devDependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/dev-status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/0xProject/0x-launch-kit-frontend/badge.svg?branch=feature%2Fcoveralls)](https://coveralls.io/github/0xProject/0x-launch-kit-frontend?branch=feature%2Fcoveralls)

The project was bootstraped using [`create-react-app`](https://github.com/facebook/create-react-app), but the development server will listen for incoming requests on port `3001`. The configuration proxies `'^/api'` requests to a running instance of `0x-launch-kit` on port `3000`.

### How to launch dev server:

To start a [`0x-launch-kit`](https://github.com/0xProject/0x-launch-kit) instance, head to its GitHub page, clone the repository and follow the corresponding instructions.

```
$ git clone https://github.com/0xProject/0x-launch-kit-frontend
$ cd 0x-launch-kit-frontend
$ yarn
$ yarn start
```

### How to use with docker

```
To run the app with docker, follow these steps:

1. Create the docker image: `docker build -t 0x-launch-kit-frontend .`
2. Run the container, exposing the port 80 to whichever port you want: `docker run -p 8080:80 0x-launch-kit-frontend`
3. Open `localhost:8080` in your browser.

You can configure the URL of the relayer by setting the `REACT_APP_RELAYER_URL` environment variable at *build time*.
```
