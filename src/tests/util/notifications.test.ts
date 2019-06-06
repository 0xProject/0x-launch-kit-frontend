import { assetDataUtils, BigNumber, ExchangeFillEventArgs } from '0x.js';

import { getKnownTokens } from '../../util/known_tokens';
import {
    buildOrderFilledNotification,
    getEtherscanUrlForNotificationTx,
    getTransactionHashFromNotification,
} from '../../util/notifications';
import { addressFactory } from '../../util/test-utils';
import { Notification, OrderSide } from '../../util/types';

describe('buildOrderFilledNotification', () => {
    const knownTokens = getKnownTokens();
    const zrxToken = knownTokens.getTokenBySymbol('zrx');
    const wethToken = knownTokens.getWethToken();

    // ZRX/WETH
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(zrxToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);

    const markets = [
        {
            price: null,
            currencyPair: {
                base: 'zrx',
                quote: 'weth',
            },
        },
        {
            price: null,
            currencyPair: {
                base: 'mkr',
                quote: 'weth',
            },
        },
        {
            price: null,
            currencyPair: {
                base: 'zrx',
                quote: 'mkr',
            },
        },
    ];

    it('should create a notification for a fill of a buy order', () => {
        // given
        const args: ExchangeFillEventArgs = {
            feeRecipientAddress: addressFactory.build().address,
            makerAddress: addressFactory.build().address,
            takerAddress: addressFactory.build().address,
            senderAddress: addressFactory.build().address,
            makerAssetFilledAmount: new BigNumber(2),
            takerAssetFilledAmount: new BigNumber(1),
            makerFeePaid: new BigNumber(0),
            takerFeePaid: new BigNumber(0),
            orderHash: '',
            makerAssetData: baseTokenAssetData,
            takerAssetData: quoteTokenAssetData,
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const notification = buildOrderFilledNotification(log, knownTokens, markets);

        // then
        expect(notification.amount).toEqual(new BigNumber(1));
        expect(notification.side).toEqual(OrderSide.Buy);
    });

    it('should create a notification for a fill of a sell order', () => {
        // given
        const args: ExchangeFillEventArgs = {
            feeRecipientAddress: addressFactory.build().address,
            makerAddress: addressFactory.build().address,
            takerAddress: addressFactory.build().address,
            senderAddress: addressFactory.build().address,
            makerAssetFilledAmount: new BigNumber(2),
            takerAssetFilledAmount: new BigNumber(1),
            makerFeePaid: new BigNumber(0),
            takerFeePaid: new BigNumber(0),
            orderHash: '',
            makerAssetData: quoteTokenAssetData,
            takerAssetData: baseTokenAssetData,
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const notification = buildOrderFilledNotification(log, knownTokens, markets);

        // then
        expect(notification.amount).toEqual(new BigNumber(2));
        expect(notification.side).toEqual(OrderSide.Sell);
    });
});

describe('getTransactionHashFromNotification and getTransactionHashFromNotification', () => {
    const notifications = [
        {
            value: {
                id:
                    '0x1b74fa746dd333eabfbf5125b54882675e384d73f0240a0db580ad4e1b70bcb8cb09f92ea2a1febffe40e6dd3e4e5319a1ca1edf496812274a18039303d4dd508d02',
                kind: 'Limit',
                amount: new BigNumber('1000000000000000000'),
                token: {
                    address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
                    symbol: 'zrx',
                    decimals: 18,
                    name: '0x',
                    primaryColor: '#333333',
                },
                side: 1,
                timestamp: new Date('2019-04-17T19:13:38.362Z'),
            },
            expectedUrl: 'https://etherscan.io/tx/0x1b74fa746dd333eabfbf5125b54882675e384d73f0240a0db580ad4e1b70bcb8',
            expectedTxHash: '0x1b74fa746dd333eabfbf5125b54882675e384d73f0240a0db580ad4e1b70bcb8',
        },
        {
            value: {
                id: '0x5be9d8c576805c1c05a42af30f4c42eb087aa72e5a28d2dc2ead0fc8b30ee63a',
                kind: 'Market',
                amount: new BigNumber('1000000000000000000'),
                token: {
                    address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
                    symbol: 'zrx',
                    decimals: 18,
                    name: '0x',
                    primaryColor: '#333333',
                },
                side: 0,
                timestamp: new Date('2019-04-17T19:15:17.580Z'),
                tx: Promise.resolve({}),
            },
            expectedUrl: 'https://etherscan.io/tx/0x5be9d8c576805c1c05a42af30f4c42eb087aa72e5a28d2dc2ead0fc8b30ee63a',
            expectedTxHash: '0x5be9d8c576805c1c05a42af30f4c42eb087aa72e5a28d2dc2ead0fc8b30ee63a',
        },
        {
            value: {
                id: '0x9883d4efc12ed1b2cec08de856f324388f2fb899543fac709d5c20f2fc701dfb-0',
                kind: 'OrderFilled',
                amount: new BigNumber('50000000000000'),
                token: {
                    address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                    symbol: 'weth',
                    decimals: 18,
                    name: 'Wrapped Ether',
                    primaryColor: '#3333ff',
                },
                side: 1,
                timestamp: new Date('2019-04-02T01:36:52.000Z'),
            },
            expectedUrl: 'https://etherscan.io/tx/0x9883d4efc12ed1b2cec08de856f324388f2fb899543fac709d5c20f2fc701dfb',
            expectedTxHash: '0x9883d4efc12ed1b2cec08de856f324388f2fb899543fac709d5c20f2fc701dfb',
        },
        {
            value: {
                id:
                    '0x1be151964ce6dd0a2d05fc43bfb7726998b541e1f97f0dfa8978da41f562bee84b6a64b518d4b0c0e82d09a82f9207ca492a244b4752a559b7d50b7118702cd25f02',
                kind: 'Limit',
                amount: new BigNumber('1000000000000000000'),
                token: {
                    address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
                    symbol: 'zrx',
                    decimals: 18,
                    name: '0x',
                    primaryColor: '#333333',
                },
                side: 1,
                timestamp: new Date('2019-04-17T11:32:14.771Z'),
            },
            expectedUrl: 'https://etherscan.io/tx/0x1be151964ce6dd0a2d05fc43bfb7726998b541e1f97f0dfa8978da41f562bee8',
            expectedTxHash: '0x1be151964ce6dd0a2d05fc43bfb7726998b541e1f97f0dfa8978da41f562bee8',
        },
        {
            value: {
                id: '0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813',
                kind: 'Market',
                amount: new BigNumber('1000000000000000000'),
                token: {
                    address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
                    symbol: 'zrx',
                    decimals: 18,
                    name: '0x',
                    primaryColor: '#333333',
                },
                side: 1,
                timestamp: new Date('2019-04-16T19:10:28.876Z'),
                tx: Promise.resolve({}),
            },
            expectedUrl: 'https://etherscan.io/tx/0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813',
            expectedTxHash: '0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813',
        },
        {
            value: {
                id: '0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813-0',
                kind: 'OrderFilled',
                amount: new BigNumber('510000000000000000'),
                side: 1,
                timestamp: new Date('2019-04-16T19:10:28.000Z'),
                token: {
                    address: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
                    symbol: 'weth',
                    decimals: 18,
                    name: 'Wrapped Ether',
                    primaryColor: '#3333ff',
                },
            },
            expectedUrl: 'https://etherscan.io/tx/0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813',
            expectedTxHash: '0xb0f540b4d996d05c84fc7acac3c339e85e7aa2f1e62e789facd2ae5fdabea813',
        },
    ];

    for (const item of notifications) {
        const { value, expectedUrl, expectedTxHash } = item;
        const url = getEtherscanUrlForNotificationTx(value as Notification);
        expect(url).toEqual(expectedUrl);
        const transactionHash = getTransactionHashFromNotification(value as Notification);
        expect(transactionHash).toEqual(expectedTxHash);
    }
});
