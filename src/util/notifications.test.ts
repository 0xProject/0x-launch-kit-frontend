import { assetDataUtils, BigNumber, ExchangeFillEventArgs } from '0x.js';

import { WETH_TOKEN_SYMBOL } from '../common/constants';

import { KnownTokens } from './known_tokens';
import { buildOrderFilledNotification } from './notifications';
import { addressFactory, tokenMetaDataFactory } from './test-utils';
import { OrderSide } from './types';

const tokens = tokenMetaDataFactory.buildList(5);
const wethToken = tokenMetaDataFactory.build({
    symbol: WETH_TOKEN_SYMBOL,
});
const knownTokens = new KnownTokens(50, [...tokens, wethToken]);

describe('buildOrderFilledNotification', () => {
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
            makerAssetData: assetDataUtils.encodeERC20AssetData(wethToken.addresses[50]),
            takerAssetData: assetDataUtils.encodeERC20AssetData(tokens[0].addresses[50]),
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const notification = buildOrderFilledNotification(log, knownTokens);

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
            makerAssetData: assetDataUtils.encodeERC20AssetData(tokens[0].addresses[50]),
            takerAssetData: assetDataUtils.encodeERC20AssetData(wethToken.addresses[50]),
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const notification = buildOrderFilledNotification(log, knownTokens);

        // then
        expect(notification.amount).toEqual(new BigNumber(2));
        expect(notification.side).toEqual(OrderSide.Sell);
    });

    it('should throw if neither side of the filling is weth', () => {
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
            makerAssetData: assetDataUtils.encodeERC20AssetData(tokens[0].addresses[50]),
            takerAssetData: assetDataUtils.encodeERC20AssetData(tokens[1].addresses[50]),
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        expect(() => buildOrderFilledNotification(log, knownTokens)).toThrow();
    });
});
