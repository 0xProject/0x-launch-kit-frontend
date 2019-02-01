import { Token } from './types';

export const getWethToken = (networkId: number): Token => {
    const tokensMap: { [x: number]: Token } = {
        42: {
            symbol: 'WETH',
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            decimals: 18,
        },
        50: {
            symbol: 'WETH',
            address: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
            decimals: 18,
        },
    };

    return tokensMap[networkId];
};

export const getKnownTokens = (networkId: number): Token[] => {
    const tokensMap: { [x: number]: Token[] } = {
        42: [
            {
                symbol: 'ZRX',
                address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
                decimals: 18,
            },
        ],
        50: [
            {
                symbol: 'ZRX',
                address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
                decimals: 18,
            },
            // dummy tokens
            {
                symbol: 'REP',
                address: '0x6dfff22588be9b3ef8cf0ad6dc9b84796f9fb45f',
                decimals: 18,
            },
            {
                symbol: 'DGD',
                address: '0xcfc18cec799fbd1793b5c43e773c98d4d61cc2db',
                decimals: 18,
            },
            {
                symbol: 'GNT',
                address: '0xf22469f31527adc53284441bae1665a7b9214dba',
                decimals: 18,
            },
            {
                symbol: 'MKR',
                address: '0x10add991de718a69dec2117cb6aa28098836511b',
                decimals: 18,
            },
            {
                symbol: 'MLN',
                address: '0x8d61158a366019ac78db4149d75fff9dda51160d',
                decimals: 18,
            },
        ],
    };

    return tokensMap[networkId];
};
