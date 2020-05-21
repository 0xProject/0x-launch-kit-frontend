# 0x-launch-kit-frontend

[![CircleCI](https://circleci.com/gh/0xProject/0x-launch-kit-frontend.svg?style=svg)](https://circleci.com/gh/0xProject/0x-launch-kit-frontend)
[![dependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend)
[![devDependencies Status](https://david-dm.org/0xproject/0x-launch-kit-frontend/dev-status.svg)](https://david-dm.org/0xproject/0x-launch-kit-frontend?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/0xProject/0x-launch-kit-frontend/badge.svg?branch=feature%2Fcoveralls)](https://coveralls.io/github/0xProject/0x-launch-kit-frontend?branch=feature%2Fcoveralls)

This is an example implementation of a dApp that interacts with a [0x relayer](https://github.com/0xProject/standard-relayer-api). To use it, you need to have the URL of an existing relayer, or you can start one locally for use during development.

This version of Launch Kit supports 0x v3. If you're looking for v2 it is available on [this branch](https://github.com/0xProject/0x-launch-kit-frontend/tree/v2).

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

If you have the URL of an existing relayer, you can use this frontend against it. After installing the dependencies, start the application with this command, replacing `RELAYER_URL` and `RELAYER_WS_URL` with the proper value:

```
REACT_APP_RELAYER_URL='https://RELAYER_URL/' REACT_APP_RELAYER_WS_URL='wss://RELAYER_URL/' yarn start
```

A browser tab will open in the `http://localhost:3001` address. You'll need to connect MetaMask to the network used by the relayer.

You can optionally pass in any relayer endpoint that complies with the [0x Standard Relayer API](https://0x.org/docs/api#sra). For example, if you want to show liquidity from 0x API:

```
REACT_APP_RELAYER_URL='https://api.0x.org/sra/v3' REACT_APP_RELAYER_WS_URL='wss://api.0x.org/sra/v3' REACT_APP_NETWORK_ID=1 REACT_APP_CHAIN_ID=1 yarn start
```

### Creating a relayer for development

If you don't have a relayer, you can start one locally for development by running [0x-api](https://github.com/0xProject/0x-api#getting-started) directly, or by using docker-compose.  
For docker-compose, first create a `docker-compose.yml` file like this:

```yml
version: '3'
services:
    ganache:
        image: 0xorg/ganache-cli
        ports:
            - '8545:8545'
    postgres:
        image: postgres:9.6
        environment:
            - POSTGRES_USER=api
            - POSTGRES_PASSWORD=api
            - POSTGRES_DB=api
        ports:
            - '5432:5432'
    backend:
        image: 0xorg/0x-api:latest
        depends_on:
            - postgres
            - mesh
        environment:
            CHAIN_ID: '1337'
            WHITELIST_ALL_TOKENS: 'true'
            FEE_RECIPIENT: '0x0000000000000000000000000000000000000001'
            MAKER_FEE_UNIT_AMOUNT: '0'
            TAKER_FEE_UNIT_AMOUNT: '0'
            MESH_WEBSOCKET_URI: 'ws://mesh:60557'
            MESH_HTTP_URI: 'http://mesh:60556'
            POSTGRES_URI: 'postgresql://api:api@postgres/api'
            ETHEREUM_RPC_URL: 'http://ganache:8545'
        ports:
            - '3000:3000'
    mesh:
        image: 0xorg/mesh:9.0.1
        depends_on:
            - ganache
        environment:
            ETHEREUM_RPC_URL: 'http://ganache:8545'
            ETHEREUM_CHAIN_ID: 1337
            VERBOSITY: 3
            WS_RPC_ADDR: '0.0.0.0:60557'
            HTTP_RPC_ADDR: '0.0.0.0:60556'
            # You can decrease the BLOCK_POLLING_INTERVAL for test networks to
            # improve performance. See https://0x-org.gitbook.io/mesh/ for more
            # Documentation about Mesh and its environment variables.
            BLOCK_POLLING_INTERVAL: '5s'
        ports:
            - '60556:60556'
            - '60557:60557'
            - '60558:60558'
            - '60559:60559'
```

and then run `docker-compose up`. This will create four containers: one is a Postgres database, one has a ganache with the 0x contracts deployed and some test tokens, another one has an instance of [0x-api](https://github.com/0xProject/0x-api) implementation of a relayer that connects to that ganache and finally a container for [0x-mesh](https://github.com/0xProject/0x-mesh) for order sharing and discovery on a p2p network.

After starting those containers, you can run the following in another terminal. A browser tab will open in the `http://localhost:3001` address. You'll need to connect MetaMask to `localhost:8545`.

```
REACT_APP_RELAYER_URL='http://localhost:3000/sra/v3' REACT_APP_RELAYER_WS_URL='ws://localhost:3000/sra/v3' yarn start
```

> _Note: the state of the relayer will be kept between runs. If you want to start from scratch, use `docker-compose up --force-recreate`_

## Environment variables

You can create a `.env` file to set environment variables and configure the behavior of the dApp. Start by copying the example file (`cp .env.example .env`) and modify the ones you want. Some things you can configure are:

-   `REACT_APP_RELAYER_URL`: The URL of the relayer used by the dApp. Defaults to `http://localhost:3000/v3`
-   `REACT_APP_RELAYER_WS_URL`: The Websocket URL of the relayer used by the dApp. Defaults to `http://localhost:3000/`
-   `REACT_APP_FEE_PERCENTAGE`: The fee percentage amount charged on 0x orders filled via the Forwarder. Note this is limited to `*/WETH` orders for the taker.
-   `REACT_APP_FEE_RECIPIENT`: The address which receives the fees from the Forwarder.
-   `REACT_APP_NETWORK_ID`: The network id to build the front end for. E.g `42` for Kovan, `50` for Ganache
-   `REACT_APP_CHAIN_ID`: The chain id to build the front end for. E.g `42` for Kovan, `1337` for Ganache
-   `REACT_APP_DEFAULT_ORDER_EXPIRY_SECONDS`: The expiration time for an order. Defaults to 1 day.

Check `.env.example` for the full list.

### Using custom themes

If you want to add your own theme for the app, please read the [THEMES.md](THEMES.md) file
