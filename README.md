# Veridex

[![Chat with us on Discord](https://img.shields.io/badge/chat-Discord-blueViolet.svg)](https://discord.gg/JqheZms)
[![CircleCI](https://circleci.com/gh/0xProject/0x-launch-kit-frontend.svg?style=svg)](https://circleci.com/gh/0xProject/0x-launch-kit-frontend)
[![dependencies Status](https://david-dm.org/verisafe/veridex/status.svg)](https://david-dm.org/verisafe/veridex)
[![devDependencies Status](https://david-dm.org/verisafe/veridex/dev-status.svg)](https://david-dm.org/verisafe/veridex?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/VeriSafe/VeriDex/badge.svg?branch=development)](https://coveralls.io/github/VeriSafe/VeriDex?branch=development)

This project is forked from [0x-launch-kit-fronted](https://github/0xproject/0x-launch-kit-frontend) and it have a goal to be the most complete open-source 0x based dex out there. The code here will try to be on sync with the 0x frontend, but with the additional features proposed on the TODO, tests will be include following 0x style.

This source code is used on the [VeriSafe Dex as a service](https://steemit.com/zerox/@joaocampos/veridex-network-dex-as-a-service).

This repo ships with both an ERC-20 token trading interface and an ERC-721 marketplace interface. However, for now, only improvements on ERC-20 token trading will be done.

Support this fork with the following actions:

-   Add VSF, 0xbitcoin and 0x as pairs
-   Lets us know you are using this fork
-   Add a Powered by 0x and VeriSafe

With your help, we can be self-sustainable and complete the long list of TODO's. If you want a feature that is not present on the TODO list, please open an issue requesting a feature request.

## Deployed DEX's

List of deployed dex's using this source code:

-   [VeriDex](https://dex.verisafe.io)
-   [0xChange](https://0xchange.verisafe.io)

If you are using the source code of this fork, please let me know! Help the project adding VSF as a pair on your fork!

## Usage

Clone this repository and install its dependencies:

```
git clone git@github.com:VeriSafe/veridex.git
cd Veridex
yarn
```

## TODO

This is a detailed list of planned features to add to this DEX (includes VeriDex backend) on long term:

-   [x] List Dex Trades
-   [x] Add troll box using ChatBro
-   [x] Fully configuration of orderbook and sell and buy cards
-   [x] Support multiple wallets, like Portis, Torus etc please see list of planned wallets below
-   [x] Add mobile support
-   [x] Support to transfer tokens
-   [ ] List Market Trades
-   [ ] List Markets stats
-   [ ] Click on buy and sell button to auto-fill
-   [ ] Adding graphs like Trading View
-   [ ] Create a costumized front page
-   [x] List descriptions for each project
-   [ ] Report data to the most known crypto data aggregators
-   [ ] List last prices for each token
-   [ ] Theme switcher

## Planned Wallets Support

-   [x] [Metamask](https://metamask.io/)
-   [ ] [Torus](https://docs.tor.us/developers/getting-started)
-   [x] [Portis](https://developers.portis.io/)
-   [x] [Fortmatic](https://developers.fortmatic.com/)
-   [ ] [WalletConnect](https://docs.walletconnect.org/)

### Using VeriDex relayer

```
REACT_APP_RELAYER_URL='https://veridex.herokuapp.com/v2' yarn start
```

[VeriDEX OPEN API SPEC](https://verisafe.github.io/veridex-api-spec/)

This relayer has additional endpoints to enable market view data with stats and candles. We will be adding as an opt-in option use these features in your frontend. That way you can use a Standard Relayer without any issues.

## Environment variables

You can create a `.env` file to set environment variables and configure the behavior of the dApp. Start by copying the example file (`cp .env.example .env`) and modify the ones you want. Some things you can configure are:

-   `REACT_APP_RELAYER_URL`: The URL of the relayer used by the dApp. Defaults to `http://localhost:3001/api/v2`

Check `.env.example` for the full list.

### Using custom themes

If you want to add your own theme for the app, please read the [THEMES.md](THEMES.md) file

### Using custom Config on the DEX

If you want to config the app and markets, please read the [CONFIG.md](CONFIG.md) file
