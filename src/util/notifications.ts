import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { getOrderSideFromFilledEvent, KnownTokens } from './known_tokens';
import { Market, NotificationKind, OrderFilledNotification, OrderSide, Token } from './types';

export const buildOrderFilledNotification = (
    log: LogWithDecodedArgs<ExchangeFillEventArgs>,
    knownTokens: KnownTokens,
    markets: Market[] | null,
): OrderFilledNotification => {
    const { args } = log;
    const wethToken = knownTokens.getWethToken();

    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);

    const side: OrderSide = getOrderSideFromFilledEvent(knownTokens, log, markets, wethAssetData);
    let exchangedTokenAddress: string;
    let exchangedToken: Token;
    exchangedTokenAddress = OrderSide.Sell
        ? assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress
        : assetDataUtils.decodeERC20AssetData(args.takerAssetData).tokenAddress;

    exchangedToken = knownTokens.getTokenByAddress(exchangedTokenAddress);
    return {
        id: `${log.transactionHash}-${log.logIndex}`,
        kind: NotificationKind.OrderFilled,
        amount: side === OrderSide.Buy ? args.takerAssetFilledAmount : args.makerAssetFilledAmount,
        side,
        timestamp: new Date(),
        token: exchangedToken,
    };
};
