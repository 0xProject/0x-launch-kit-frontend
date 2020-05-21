# Custom Config Guide

A config file can be used to modify the tokens, trading pairs, themes and general properties of Launch Kit front end.

### Customizing Launch Kit

The config file lives at `src/config.json`.

<details><summary>Example Config</summary>

```json
{
    "general": {
        "title": "Launch Kit"
    },
    "tokens": [
        {
            "symbol": "zrx",
            "name": "0x Protocol Token",
            "primaryColor": "#333333",
            "icon": "assets/icons/zrx.svg",
            "addresses": {
                "1": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
                "3": "0xff67881f8d12f372d91baae9752eb3631ff0ed00",
                "4": "0x8080c7e4b81ecf23aa6f877cfbfd9b0c228c6ffa",
                "42": "0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa",
                "50": "0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c"
            },
            "decimals": 18,
            "displayDecimals": 2
        },
        {
            "symbol": "weth",
            "name": "Wrapped Ether",
            "primaryColor": "#3333ff",
            "icon": "assets/icons/weth.svg",
            "addresses": {
                "1": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "3": "0xc778417e063141139fce010982780140aa0cd5ab",
                "4": "0xc778417e063141139fce010982780140aa0cd5ab",
                "42": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
                "50": "0x0b1ba0af832d7c05fd64161e0db78e85978e8082"
            },
            "decimals": 18,
            "displayDecimals": 2
        },
        {
            "decimals": 18,
            "symbol": "dai",
            "name": "Dai",
            "icon": "assets/icons/dai.svg",
            "primaryColor": "#DEA349",
            "addresses": {
                "1": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
                "3": "0xfc8862446cd3e4a2e7167e7d97df738407fead07",
                "4": "0x6f2d6ff85efca691aad23d549771160a12f0a0fc",
                "42": "0xc4375b7de8af5a38a93548eb8453a498222c4ff2",
                "50": ""
            }
        },
        {
            "decimals": 18,
            "symbol": "mkr",
            "name": "Maker",
            "primaryColor": "#68CCBB",
            "icon": "assets/icons/mkr.svg",
            "addresses": {
                "1": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
                "3": "0x06732516acd125b6e83c127752ed5f027e1b276e",
                "4": "0xb763e26cd6dd09d16f52dc3c60ebb77e46b03290",
                "42": "0x7B6B10CAa9E8E9552bA72638eA5b47c25afea1f3",
                "50": "0x34d402f14d58e001d8efbe6585051bf9706aa064"
            }
        },
        {
            "decimals": 18,
            "symbol": "rep",
            "name": "Augur",
            "icon": "assets/icons/rep.svg",
            "primaryColor": "#512D80",
            "addresses": {
                "1": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
                "3": "0xb0b443fe0e8a04c4c85e8fda9c5c1ccc057d6653",
                "4": "0x6a732d537daf79d75efaeae286d30fc578fa98d0",
                "42": "0x8CB3971b8EB709C14616BD556Ff6683019E90d9C",
                "50": "0x25b8fe1de9daf8ba351890744ff28cf7dfa8f5e3"
            }
        },
        {
            "decimals": 9,
            "symbol": "dgx",
            "name": "DigixDao",
            "icon": "assets/icons/dgx.svg",
            "primaryColor": "#E1AA3E",
            "addresses": {
                "1": "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A",
                "3": "0xc4895a5aafa2708d6bc1294e20ec839aad156b1d",
                "4": "0xc40a46ca4bc8e6057ed571e39cf400f3f935e4d5",
                "42": "0xA4f468c9c692eb6B4b8b06270dAe7A2CfeedcDe9",
                "50": "0xcdb594a32b1cc3479d8746279712c39d18a07fc0"
            }
        },
        {
            "decimals": 18,
            "symbol": "mln",
            "name": "Melon",
            "icon": "assets/icons/mln.svg",
            "primaryColor": "#333333",
            "addresses": {
                "1": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
                "3": "0x823ebe83d39115536274a8617e00a1ff3544fd63",
                "4": "0x521c0941300a18a4edc697368f43a6a870be1f3d",
                "42": "0x17e394D1Df6cE29d042195Ea38411A98ff3Ead94",
                "50": "0x1e2f9e10d02a6b8f8f69fcbf515e75039d2ea30d"
            }
        }
    ],
    "pairs": [
        {
            "base": "zrx",
            "quote": "weth"
        },
        {
            "base": "zrx",
            "quote": "dai"
        },
        {
            "base": "mkr",
            "quote": "weth"
        },
        {
            "base": "mln",
            "quote": "weth"
        },
        {
            "base": "dgx",
            "quote": "weth"
        },
        {
            "base": "rep",
            "quote": "weth"
        }
    ],
    "marketFilters": [
        {
            "text": "ETH",
            "value": "weth"
        },
        {
            "text": "DAI",
            "value": "dai"
        }
    ]
}
```

</details>

### General

There are a few general configuration options for Launch Kit.

```json
{
    "general": {
        "title": "Launch Kit",
        "icon": "assets/icons/zrx.svg"
    }
}
```

| property | description                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------- |
| title    | The title used on the page, defaults to "Launch Kit"                                                 |
| icon     | The icon to render, defaults to the Launch Kit image. This must be an SVG located in `public` folder |

#### Tokens

Inside the config is a tokens section. This is an array of all of the tokens used in Launch Kit. They will be displayed in the Wallet section and are required for the trading pairs. If you wish to test and switch between multiple networks it is good to have the contract address for each network.

```json
{
    "tokens:": [
        {
            "decimals": 18,
            "displayDecimals": 4,
            "symbol": "mkr",
            "name": "Maker",
            "primaryColor": "#68CCBB",
            "icon": "assets/icons/mkr.svg",
            "addresses": {
                "1": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
                "3": "0x06732516acd125b6e83c127752ed5f027e1b276e",
                "4": "0xb763e26cd6dd09d16f52dc3c60ebb77e46b03290",
                "42": "0x7B6B10CAa9E8E9552bA72638eA5b47c25afea1f3",
                "50": "0x34d402f14d58e001d8efbe6585051bf9706aa064"
            }
        }
    ]
}
```

| property        | description                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| decimals        | The number of decimals for this token. This is used to calculate the price and convert to units (smallest possible value). For example ZRX is 18 decimals, so 1 ZRX is `1*10^18` units |
| displayDecimals | The number of decimals to display for the token in the UI                                                                                                                              |
| symbol          | The Symbol for the token. **Ensure this is lowercase**. This is used in the Market dropdowns and in the Wallet and Order info UI                                                       |
| name            | The descriptive name for the token                                                                                                                                                     |
| icon            | The icon to render for this token. This must be SVG file format and should be placed in the `public` folder                                                                            |
| primaryColor    | If an SVG cannot be found then this is used to differentiate the tokens in the Wallet and Market dropdown                                                                              |
| addresses       | A list of addresses for the token for various networks                                                                                                                                 |

### Pairs

The pairs lists the available markets for the front end to render. This appears in the Market Dropdown component.

```json
{
    "pairs": [
        {
            "base": "zrx",
            "quote": "weth"
        },
        {
            "base": "mkr",
            "quote": "weth"
        }
    ]
}
```

| property | description                         |
| -------- | ----------------------------------- |
| base     | The base token in the trading pair  |
| quote    | The quote token in the trading pair |

### Market Filters

```json
{
    "marketFilters": [
        {
            "text": "ETH",
            "value": "weth"
        },
        {
            "text": "DAI",
            "value": "dai"
        }
    ]
}
```

The market filters control filtering in the Market Dropdown Component.

| property | description                          |
| -------- | ------------------------------------ |
| text     | The text value that will be rendered |
| value    | The token symbol used for filtering  |

### Theme

The theme settings can be overridden in the config file. The overrides are merged in with the defaults, so you aren't required to populate all values for a theme.

```json
{
    "theme": {
        "componentsTheme": {
            "background": "#522c80",
            "cardBackgroundColor": "#271a38",
            "topbarBackgroundColor": "#271a38",
            "inactiveTabBackgroundColor": "#1c0f2b"
        },
        "modalTheme": ...
    }
}
```

| property        | description                                                                                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| componentsTheme | The individual settings for themeing the components. The exhaustive list of properties is the type ThemeProperties and can be found [here](https://github.com/0xProject/0x-launch-kit-frontend/blob/8d6cc5be8ec536675716f4295415181c35a8b8eb/src/themes/commons.ts#L6) |
| modalTheme      | The individual settings for themeing the modal. The exhaustive list of properties is the type ThemeModalStyle and can be found [here](https://github.com/0xProject/0x-launch-kit-frontend/blob/8d6cc5be8ec536675716f4295415181c35a8b8eb/src/themes/commons.ts#L93)     |
