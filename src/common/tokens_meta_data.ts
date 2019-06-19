import { Network, TokenSymbol } from '../util/types';

export interface TokenMetaData {
    addresses: { [key: number]: string };
    symbol: TokenSymbol;
    decimals: number;
    name: string;
    primaryColor: string;
}

export const KNOWN_TOKENS_META_DATA: TokenMetaData[] = [
    {
        decimals: 18,
        symbol: TokenSymbol.Weth,
        name: 'Wrapped Ether',
        primaryColor: '#3333ff',
        addresses: {
            [Network.Mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            [Network.Rinkeby]: '0xc778417e063141139fce010982780140aa0cd5ab',
            [Network.Kovan]: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            [Network.Ganache]: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Vsf,
        name: 'VeriSafe',
        primaryColor: '#081e6e',
        addresses: {
            [Network.Mainnet]: '0xac9ce326e95f51b5005e9fe1dd8085a01f18450c',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Kubo,
        name: 'KuboCoin',
        primaryColor: '#020202',
        addresses: {
            1: '0x53d61fd3758f17e25e16b9389aa1f01e6c0c47db',
        },
    },
    {
        decimals: 6,
        symbol: TokenSymbol.Ethplo,
        name: 'ETHplode',
        primaryColor: '#1b95e0',
        addresses: {
            [Network.Mainnet]: '0xe0c6ce3e73029f201e5c0bedb97f67572a93711c',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Sntvt,
        name: 'Sentivate',
        primaryColor: '#fe2e57',
        addresses: {
            [Network.Mainnet]: '0x7865af71cf0b288b4e7f654f4f7851eb46a2b7f8',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Zrx,
        name: '0x',
        primaryColor: '#333333',
        addresses: {
            [Network.Mainnet]: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            [Network.Rinkeby]: '0x8080c7e4b81ecf23aa6f877cfbfd9b0c228c6ffa',
            [Network.Kovan]: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
            [Network.Ganache]: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Mkr,
        name: 'Maker',
        primaryColor: '#68CCBB',
        addresses: {
            [Network.Mainnet]: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            [Network.Rinkeby]: '0xb763e26cd6dd09d16f52dc3c60ebb77e46b03290',
            [Network.Kovan]: '0x7B6B10CAa9E8E9552bA72638eA5b47c25afea1f3',
            [Network.Ganache]: '0x34d402f14d58e001d8efbe6585051bf9706aa064',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Rep,
        name: 'Augur',
        primaryColor: '#512D80',
        addresses: {
            [Network.Mainnet]: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
            [Network.Rinkeby]: '0x6a732d537daf79d75efaeae286d30fc578fa98d0',
            [Network.Kovan]: '0x8CB3971b8EB709C14616BD556Ff6683019E90d9C',
            [Network.Ganache]: '0x25b8fe1de9daf8ba351890744ff28cf7dfa8f5e3',
        },
    },
    /*{
        decimals: 9,
        symbol: TokenSymbol.Dgd,
        name: 'DigixDao',
        primaryColor: '#E1AA3E',
        addresses: {
            [Network.Mainnet]: '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A',
            [Network.Rinkeby]: '0xc40a46ca4bc8e6057ed571e39cf400f3f935e4d5',
            [Network.Kovan]: '0xA4f468c9c692eb6B4b8b06270dAe7A2CfeedcDe9',
            [Network.Ganache]: '0xcdb594a32b1cc3479d8746279712c39d18a07fc0',
        },
    },*/
    {
        decimals: 18,
        symbol: TokenSymbol.Mln,
        name: 'Melon',
        primaryColor: '#333333',
        addresses: {
            [Network.Mainnet]: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
            [Network.Rinkeby]: '0x521c0941300a18a4edc697368f43a6a870be1f3d',
            [Network.Kovan]: '0x17e394D1Df6cE29d042195Ea38411A98ff3Ead94',
            [Network.Ganache]: '0x1e2f9e10d02a6b8f8f69fcbf515e75039d2ea30d',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Ftm,
        name: 'Fantom',
        primaryColor: '#020202',
        addresses: {
            [Network.Mainnet]: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
        },
    },

    /*{
        decimals: 0,
        symbol: TokenSymbol.Bomb,
        name: 'Bomb',
        primaryColor: '#020202',
        addresses: {
            [Network.Mainnet]: '',
        },
    },*/
];
