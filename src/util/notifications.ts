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
        // } else (args.takerAssetData === wethAssetData) {
    } else {
        // TODO do a proper check to infer if the Fill corresponds to a buy or a sell
        side = OrderSide.Sell;
        exchangedTokenAddress = assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress;
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
