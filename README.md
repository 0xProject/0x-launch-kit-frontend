# 0x-launch-kit-frontend

[![CircleCI](https://circleci.com/gh/0xProject/0x-launch-kit-frontend.svg?style=svg)](https://circleci.com/gh/0xProject/0x-launch-kit-frontend)
[![dependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend)
[![devDependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/dev-status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/0xProject/0x-launch-kit-frontend/badge.svg?branch=feature%2Fcoveralls)](https://coveralls.io/github/0xProject/0x-launch-kit-frontend?branch=feature%2Fcoveralls)
The project was bootstraped using [`create-react-app`](https://github.com/facebook/create-react-app), but the development server will listen for incoming requests on port `3001`. The configuration proxies `'^/api'` requests to a running instance of `0x-launch-kit` on port `3000`.

To launch the development server execute the following:

```
$ git clone https://github.com/0xProject/0x-launch-kit-frontend
$ cd 0x-launch-kit-frontend
$ yarn
$ yarn start
```

To start a [`0x-launch-kit`](https://github.com/0xProject/0x-launch-kit) instance, head to its GitHub page, clone the repository and follow the corresponding instructions.
