import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { KnownTokens } from './known_tokens';
import { NotificationKind, OrderFilledNotification, OrderSide } from './types';

export const buildOrderFilledNotification = (
    log: LogWithDecodedArgs<ExchangeFillEventArgs>,
    knownTokens: KnownTokens,
): OrderFilledNotification => {
    const { args } = log;
    const wethToken = knownTokens.getWethToken();

    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);

    let side: OrderSide;
    let exchangedTokenAddress: string;
    if (args.makerAssetData === wethAssetData) {
        side = OrderSide.Buy;
        exchangedTokenAddress = assetDataUtils.decodeERC20AssetData(args.takerAssetData).tokenAddress;
    } else if (args.takerAssetData === wethAssetData) {
        side = OrderSide.Sell;
        exchangedTokenAddress = assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress;
    } else {
        throw new Error('Order does not involve wETH');
    }

    const exchangedToken = knownTokens.getTokenByAddress(exchangedTokenAddress);

    return {
        id: `${log.transactionHash}-${log.logIndex}`,
        kind: NotificationKind.OrderFilled,
        amount: side === OrderSide.Buy ? args.takerAssetFilledAmount : args.makerAssetFilledAmount,
        side,
        timestamp: new Date(),
        token: exchangedToken,
    };
};
