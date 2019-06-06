import { TokenSymbol } from '../util/types';

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
        primaryColor: '#3c3c3d',
        addresses: {
            1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // 4: '0xc778417e063141139fce010982780140aa0cd5ab',
            // 42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            // 50: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Dai,
        name: 'Dai Stablecoin',
        primaryColor: '#d6ba1b',
        addresses: {
            1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Pax,
        name: 'Paxos Standard',
        primaryColor: '#3ec97a',
        addresses: {
            1: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Tusd,
        name: 'TrueUSD',
        primaryColor: '#09008e',
        addresses: {
            1: '0x0000000000085d4780B73119b644AE5ecd22b376',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 6,
        symbol: TokenSymbol.Usdc,
        name: 'USD Coin',
        primaryColor: '#00558e',
        addresses: {
            1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 6,
        symbol: TokenSymbol.Usds,
        name: 'StableUSD',
        primaryColor: '#177dc1',
        addresses: {
            1: '0xa4bdb11dc0a2bec88d24a3aa1e6bb17201112ebe',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 6,
        symbol: TokenSymbol.Usdt,
        name: 'Tether USD',
        primaryColor: '#00754a',
        addresses: {
            1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            // 4: 'ROPSTEN ADDRESS',
            // 42: 'KOVAN ADDRESS',
            // 50: 'GANACHE ADDRESS',
        },
    },
    {
        decimals: 18,
        symbol: TokenSymbol.Zrx,
        name: '0x',
        primaryColor: '#333333',
        addresses: {
            1: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            // 4: '0x8080c7e4b81ecf23aa6f877cfbfd9b0c228c6ffa',
            // 42: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
            // 50: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        },
    },
];
