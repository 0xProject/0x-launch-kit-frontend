import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { KnownTokens } from './known_tokens';
import { getTransactionLink } from './transaction_link';
import { Market, Notification, NotificationKind, OrderFilledNotification, OrderSide, Token } from './types';

export const buildOrderFilledNotification = (
    log: LogWithDecodedArgs<ExchangeFillEventArgs>,
    knownTokens: KnownTokens,
    markets: Market[] | null,
): OrderFilledNotification => {
    const { args } = log;
    const side: OrderSide = getOrderSideFromFillEvent(knownTokens, log, markets);
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

export const getOrderSideFromFillEvent = (
    knownTokens: KnownTokens,
    fillEvent: LogWithDecodedArgs<ExchangeFillEventArgs>,
    markets: Market[] | null,
): OrderSide => {
    if (!knownTokens.isValidFillEvent(fillEvent)) {
        throw new Error('The event is not valid');
    }
    const { makerAssetData, takerAssetData } = fillEvent.args;
    const wethToken = knownTokens.getWethToken();
    const makerTokenAddress = assetDataUtils.decodeERC20AssetData(makerAssetData).tokenAddress;
    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(takerAssetData).tokenAddress;
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);
    let orderSide: OrderSide = OrderSide.Buy;
    // Fallback in case there are not markets
    if (!markets) {
        orderSide = makerAssetData === wethAssetData ? OrderSide.Buy : OrderSide.Sell;
    } else {
        for (const market of markets) {
            const baseSymbol = market.currencyPair.base;
            const quoteSymbol = market.currencyPair.quote;
            const baseToken = knownTokens.getTokenBySymbol(baseSymbol);
            const quoteToken = knownTokens.getTokenBySymbol(quoteSymbol);
            // Make sure all the address's are at lower case
            if (makerTokenAddress.toLowerCase() === baseToken.address.toLowerCase() && takerTokenAddress.toLowerCase() === quoteToken.address.toLowerCase()) {
                // This is a sell order --> fill event is a buy
                orderSide = OrderSide.Buy;
                break;
            } else if (makerTokenAddress.toLowerCase() === quoteToken.address.toLowerCase() && takerTokenAddress.toLowerCase() === baseToken.address.toLowerCase()) {
                // This is a buy order --> fill event is a sell
                orderSide = OrderSide.Sell;
                break;
            }
        }
    }

    return orderSide;
};

export const getTransactionHashFromNotification = (notification: Notification): string => {
    return notification.id.slice(0, 66);
};

export const getEtherscanUrlForNotificationTx = (notification: Notification): string => {
    const hash = getTransactionHashFromNotification(notification);
    return getTransactionLink(hash);
};
