import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { KnownTokens } from './known_tokens';
import { Market, NotificationKind, OrderFilledNotification, OrderSide, Token } from './types';

export const buildOrderFilledNotification = (
    log: LogWithDecodedArgs<ExchangeFillEventArgs>,
    knownTokens: KnownTokens,
    markets: Market[] | null,
): OrderFilledNotification => {
    const { args } = log;
    const side: OrderSide = getOrderSideFromFilledEvent(knownTokens, log, markets);
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

export const getOrderSideFromFilledEvent = (
    knownTokens: KnownTokens,
    fillEvent: LogWithDecodedArgs<ExchangeFillEventArgs>,
    markets: Market[] | null,
): OrderSide => {
    const { makerAssetData, takerAssetData } = fillEvent.args;
    const wethToken = knownTokens.getWethToken();
    const makerTokenAddress = assetDataUtils.decodeERC20AssetData(makerAssetData).tokenAddress;
    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(takerAssetData).tokenAddress;
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);
    let orderSide: OrderSide = OrderSide.Sell;
    if (!knownTokens.isValidFillEvent(fillEvent)) {
        throw new Error('The event is not valid');
    }
    // Fallback in case there are not markets
    if (!markets) {
        orderSide = makerAssetData === wethAssetData ? OrderSide.Buy : OrderSide.Sell;
    } else {
        markets.forEach(market => {
            const baseSymbol = market.currencyPair.base;
            const quoteSymbol = market.currencyPair.quote;
            const baseToken = knownTokens.getTokenBySymbol(baseSymbol);
            const quoteToken = knownTokens.getTokenBySymbol(quoteSymbol);
            if (makerTokenAddress === baseToken.address && takerTokenAddress === quoteToken.address) {
                // This is a sell order --> fill event is a buy
                orderSide = OrderSide.Buy;
            } else if (makerTokenAddress === quoteToken.address && takerTokenAddress === baseToken.address) {
                // This is a buy order --> fill event is a sell
                orderSide = OrderSide.Sell;
            }
        });
    }

    return orderSide;
};
