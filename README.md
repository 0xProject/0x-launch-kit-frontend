# 0x-launch-kit-frontend

[![CircleCI](https://circleci.com/gh/0xProject/0x-launch-kit-frontend.svg?style=svg)](https://circleci.com/gh/0xProject/0x-launch-kit-frontend)
[![dependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend)
[![devDependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/dev-status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/0xProject/0x-launch-kit-frontend/badge.svg?branch=feature%2Fcoveralls)](https://coveralls.io/github/0xProject/0x-launch-kit-frontend?branch=feature%2Fcoveralls)

This is an example implementation of a dApp that interacts with a [0x relayer](https://github.com/0xProject/standard-relayer-api). To use it, you need to have the URL of an existing relayer, or you can start one locally for use during development.

This repo ships with both an ERC-20 token trading interface and an ERC-721 marketplace interface.

|                              ERC-20                              |                              ERC-721                              |
| :--------------------------------------------------------------: | :---------------------------------------------------------------: |
| ![](https://s3.eu-west-2.amazonaws.com/0x-wiki-images/erc20.png) | ![](https://s3.eu-west-2.amazonaws.com/0x-wiki-images/erc721.png) |

## Usage

Clone this repository and install its dependencies:

```
git clone git@github.com:0xProject/0x-launch-kit-frontend.git
cd 0x-launch-kit-frontend
yarn
```

### Using an existing relayer

If you have the URL of an existing relayer, you can use this frontend against it. After installing the dependencies, start the application with this command, replacing `RELAYER_URL` with the proper value:

```
REACT_APP_RELAYER_URL='https://RELAYER_URL/api/v2' yarn start
```

A browser tab will open in the `http://localhost:3001` address. You'll need to connect MetaMask to the network used by the relayer.

You can optionally pass in any relayer endpoint that complies with the [0x Standard Relayer API](https://github.com/0xProject/standard-relayer-api). For example, if you want to mirror Kovan liquidity from [Radar Relay](https://radarrelay.com/):

```
REACT_APP_RELAYER_URL='https://api.kovan.radarrelay.com/0x/v2' yarn start
```

These commands start the app in development mode. You can run `yarn build` to build the assets. The results will be in the `build` directory. Remember to set the environment variable with the relayer URL when running the `build` command:

```
REACT_APP_RELAYER_URL='https://RELAYER_URL/api/v2' yarn build
serve ./build
```

### Creating a relayer for development

If you don't have a relayer, you can start one locally for development. First create a `docker-compose.yml` file like this:

```yml
version: '3'
services:
    ganache:
        image: fvictorio/0x-ganache-testing:0.0.1
        ports:
            - '8545:8545'
    launch-kit:
        image: fvictorio/0x-launch-kit-testing
        environment:
            HTTP_PORT: '3000'
            RPC_URL: 'http://ganache:8545'
            NETWORK_ID: '50'
        ports:
            - '3000:3000'
        depends_on:
            - ganache
```

and then run `docker-compose up`. This will create two containers: one has a ganache with the 0x contracts deployed and some test tokens, and the other one has an instance of the [launch kit](https://github.com/0xProject/0x-launch-kit) implementation of a relayer that connects to that ganache.

After starting those containers, you can run `yarn start` in another terminal. A browser tab will open in the `http://localhost:3001` address. You'll need to connect MetaMask to `localhost:8545`.

> _Note: the state of the relayer will be kept between runs. If you want to start from scratch, use `docker-compose up --force-recreate`_

## Environment variables

You can create a `.env` file to set environment variables and configure the behavior of the dApp. Start by copying the example file (`cp .env.example .env`) and modify the ones you want. Some things you can configure are:

-   `REACT_APP_RELAYER_URL`: The URL of the relayer used by the dApp. Defaults to `http://localhost:3001/api/v2`

Check `.env.example` for the full list.

### Using custom themes

If you want to add your own theme for the app, please read the [THEMES.md](THEMES.md) file
