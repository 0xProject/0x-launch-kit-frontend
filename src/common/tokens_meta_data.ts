export interface TokenMetaData {
    addresses: { [key: number]: string };
    symbol: string;
    decimals: number;
    name: string;
}

export const KNOWN_TOKENS_META_DATA: TokenMetaData[] = [
    {
        decimals: 18,
        symbol: 'weth',
        name: 'Wrapped Ether',
        addresses: {
            42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            50: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
        },
    },
    {
        decimals: 18,
        symbol: 'zrx',
        name: '0x',
        addresses: {
            42: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
            50: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        },
    },
    {
        decimals: 18,
        symbol: 'mkr',
        name: 'Maker',
        addresses: {
            50: '0x10add991de718a69dec2117cb6aa28098836511b',
        },
    },
    {
        decimals: 18,
        symbol: 'rep',
        name: 'Augur',
        addresses: {
            50: '0x6dfff22588be9b3ef8cf0ad6dc9b84796f9fb45f',
        },
    },
    {
        decimals: 9,
        symbol: 'dgd',
        name: 'DigixDao',
        addresses: {
            50: '0xcfc18cec799fbd1793b5c43e773c98d4d61cc2db',
        },
    },
    {
        decimals: 18,
        symbol: 'mln',
        name: 'Melon',
        addresses: {
            50: '0x8d61158a366019ac78db4149d75fff9dda51160d',
        },
    },
];
