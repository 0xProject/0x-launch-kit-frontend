import { NETWORK_ID } from '../../common/constants';
import { KNOWN_TOKENS_META_DATA, TokenMetaData } from '../../common/tokens_meta_data';
import { getKnownTokens, isERC20AssetData, KnownTokens } from '../../util/known_tokens';
import { Token } from '../../util/types';

const dummyTokensMetaData: TokenMetaData[] = [
    {
        decimals: 18,
        symbol: 'weth',
        name: 'Wrapped Ether',
        addresses: {
            [NETWORK_ID]: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
        },
        primaryColor: '#ccc',
    },
    {
        decimals: 18,
        symbol: 'zrx',
        name: '0x',
        addresses: {
            [NETWORK_ID]: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        },
        primaryColor: '#ccc',
    },
];
const wethToken: Token = {
    address: dummyTokensMetaData[0].addresses[NETWORK_ID],
    symbol: dummyTokensMetaData[0].symbol,
    decimals: dummyTokensMetaData[0].decimals,
    name: dummyTokensMetaData[0].name,
    primaryColor: '#ccc',
    displayDecimals: 2,
    icon: undefined,
};
const zrxToken: Token = {
    address: dummyTokensMetaData[1].addresses[NETWORK_ID],
    symbol: dummyTokensMetaData[1].symbol,
    decimals: dummyTokensMetaData[1].decimals,
    name: dummyTokensMetaData[1].name,
    primaryColor: '#ccc',
    displayDecimals: 2,
    icon: undefined,
};

const fillEvent1 = {
    address: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
    blockHash: '0x76ae8d8c46f904cdeeff6e5e880278b36ca638db3a03fc08fcb2189c9e43a856',
    blockNumber: 10625507,
    data:
        '0x0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa00000000000000000000000000000000000000000000000000000000',
    logIndex: 2,
    removed: false,
    topics: [
        '0x0bcc4c97732e47d9946f229edb95f5b6323f601300e4690de719993f3c371129',
        '0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x55982ab3b35a822e9d4fb17599ab7f1df4306252b44824f1bce10ef606fba372',
    ],
    transactionHash: '0x98353d0d961442d1e24e973e9fa598df84e95768b8a0f7838cc2f86028930c0b',
    transactionIndex: 5,
    transactionLogIndex: '0x0',
    type: 'mined',
    event: 'Fill',
    args: {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        takerAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        senderAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        makerAssetFilledAmount: '900000000000000000',
        takerAssetFilledAmount: '1000000000000000000',
        makerFeePaid: '1000000000000000000',
        takerFeePaid: '100000000000000000',
        orderHash: '0x55982ab3b35a822e9d4fb17599ab7f1df4306252b44824f1bce10ef606fba372',
        makerAssetData: '0xf47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3',
        takerAssetData: '0xf47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa',
    },
};

const fillEvent2 = {
    address: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
    blockHash: '0xc32d0a7ef83a433098c8ad515bac0bc3b87e3256d010ff882fdfcc05b1f80aeb',
    blockNumber: 10650255,
    data:
        '0x0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa00000000000000000000000000000000000000000000000000000000',
    logIndex: 0,
    removed: false,
    topics: [
        '0x0bcc4c97732e47d9946f229edb95f5b6323f601300e4690de719993f3c371129',
        '0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
    ],
    transactionHash: '0x365432a16653d10a84a8c436de2cbd22aff33644c69d923c9d25ca9df2e2ce3f',
    transactionIndex: 0,
    transactionLogIndex: '0x0',
    type: 'mined',
    event: 'Fill',
    args: {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        takerAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        senderAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        makerAssetFilledAmount: '1000000000000000000',
        takerAssetFilledAmount: '1000000000000000000',
        makerFeePaid: '1000000000000000000',
        takerFeePaid: '100000000000000000',
        orderHash: '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
        makerAssetData: '0xf47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3',
        takerAssetData: '0xf47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa',
    },
};

const fillEvent3 = {
    address: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
    blockHash: '0xc32d0a7ef83a433098c8ad515bac0bc3b87e3256d010ff882fdfcc05b1f80aeb',
    blockNumber: 10650255,
    data:
        '0x0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa00000000000000000000000000000000000000000000000000000000',
    logIndex: 0,
    removed: false,
    topics: [
        '0x0bcc4c97732e47d9946f229edb95f5b6323f601300e4690de719993f3c371129',
        '0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
    ],
    transactionHash: '0x365432a16653d10a84a8c436de2cbd22aff33644c69d923c9d25ca9df2e2ce3f',
    transactionIndex: 0,
    transactionLogIndex: '0x0',
    type: 'mined',
    event: 'Fill',
    args: {
        makerAddress: '0x7409ed021d9299bf6814279a6a1411a7e866a631',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        takerAddress: '0x8ecbe1db9ef729cbe972c83fb886247691fb6beb',
        senderAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        makerAssetFilledAmount: '1000000000000000000',
        takerAssetFilledAmount: '1000000000000000000',
        makerFeePaid: '1000000000000000000',
        takerFeePaid: '100000000000000000',
        orderHash: '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
        makerAssetData: '0xc47261b00000000000000000000000005b7b10caa9e8e9552ba72638ea5b47c25afea1f3',
        takerAssetData: '0xc47261b00000000000000000000000003012d3812f58e35f0ea1ffbf80a75a38c32175fa',
    },
};

const fillEvent4 = {
    address: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
    blockHash: '0xc32d0a7ef83a433098c8ad515bac0bc3b87e3256d010ff882fdfcc05b1f80aeb',
    blockNumber: 10650255,
    data:
        '0x0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000006ecbe1db9ef729cbe972c83fb886247691fb6beb0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000007b6b10caa9e8e9552ba72638ea5b47c25afea1f3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa00000000000000000000000000000000000000000000000000000000',
    logIndex: 0,
    removed: false,
    topics: [
        '0x0bcc4c97732e47d9946f229edb95f5b6323f601300e4690de719993f3c371129',
        '0x0000000000000000000000005409ed021d9299bf6814279a6a1411a7e866a631',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
    ],
    transactionHash: '0x365432a16653d10a84a8c436de2cbd22aff33644c69d923c9d25ca9df2e2ce3f',
    transactionIndex: 0,
    transactionLogIndex: '0x0',
    type: 'mined',
    event: 'Fill',
    args: {
        makerAddress: '0x7409ed021d9299bf6814279a6a1411a7e866a631',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        takerAddress: '0x8ecbe1db9ef729cbe972c83fb886247691fb6beb',
        senderAddress: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
        makerAssetFilledAmount: '1000000000000000000',
        takerAssetFilledAmount: '1000000000000000000',
        makerFeePaid: '1000000000000000000',
        takerFeePaid: '100000000000000000',
        orderHash: '0x6d2a42e67403effdbf797f25ef87083a6a3d21a0bcabd6b04b00060ad6afc3cd',
        makerAssetData: '0xc47261b00000000000000000000000005b6c40caa9e8e9552ba72638ea5b47c25afea1f3',
        takerAssetData: '0xc47261b00000000000000000000000003004d3812f58e35f0ea1ffbf80a75a38c32175fa',
    },
};

describe('getKnownTokens', () => {
    it('should return an instance of KnownTokens', () => {
        const knownTokens = getKnownTokens(dummyTokensMetaData);
        expect(knownTokens).toBeTruthy();
    });
});

describe('KnownTokens', () => {
    it('should take networkId and TokenMetada[] to instantiate', () => {
        const knownTokens = new KnownTokens(dummyTokensMetaData);
        expect(knownTokens).toBeTruthy();
    });

    describe('getTokenBySymbol', () => {
        it('should return Token when the corresponding TokenMetada was present on init', () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(knownTokens.getTokenBySymbol('zrx')).toEqual(zrxToken);
        });

        it('should throw the TokenMetada specified by the given symbol was not present on init', () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(() => knownTokens.getTokenBySymbol('somethingwrong')).toThrow();
        });
    });

    describe('getWethToken', () => {
        it('should return Token generated by the TokenMetada present on init', () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(knownTokens.getWethToken()).toEqual(wethToken);
        });
    });

    describe('getTokens', () => {
        it('should return Token[] generated by the TokenMetada present on init (except weth)', () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(knownTokens.getTokens()).toEqual([zrxToken]);
        });
    });

    describe('isKnownAddress', () => {
        it('should return true if a token address exist', () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(knownTokens.isKnownAddress(dummyTokensMetaData[1].addresses[NETWORK_ID])).toBeTruthy();
        });

        it(`should return false if a token address doesn't exist `, () => {
            const knownTokens = new KnownTokens(dummyTokensMetaData);
            expect(knownTokens.isKnownAddress(`wrongaddress`)).toBeFalsy();
        });
    });

    describe('isValidFillEvent', () => {
        it('should return false if an Event is invalid', () => {
            const knownTokens = new KnownTokens(KNOWN_TOKENS_META_DATA);
            // @ts-ignore
            expect(knownTokens.isValidFillEvent(fillEvent3)).toBeFalsy();
            // @ts-ignore
            expect(knownTokens.isValidFillEvent(fillEvent4)).toBeFalsy();
        });
    });

    describe('isERC20AssetData', () => {
        it('should return true if is an ERC20', () => {
            expect(isERC20AssetData(fillEvent1.args.makerAssetData)).toBeTruthy();
            expect(isERC20AssetData(fillEvent1.args.takerAssetData)).toBeTruthy();
            expect(isERC20AssetData(fillEvent2.args.makerAssetData)).toBeTruthy();
            expect(isERC20AssetData(fillEvent2.args.takerAssetData)).toBeTruthy();
        });

        it('should return false if is not an ERC20', () => {
            expect(isERC20AssetData(fillEvent3.args.makerAssetData)).toBeFalsy();
            expect(isERC20AssetData(fillEvent3.args.takerAssetData)).toBeFalsy();
            expect(isERC20AssetData(fillEvent4.args.makerAssetData)).toBeFalsy();
            expect(isERC20AssetData(fillEvent4.args.takerAssetData)).toBeFalsy();
        });
    });
});
