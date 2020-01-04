import { ExchangeFillEventArgs, LogWithDecodedArgs } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { getKnownTokens, KnownTokens } from './known_tokens';
import { marketToStringFromTokens } from './markets';
import { getOrderSideFromFillEvent } from './notifications';
import { getTransactionLink } from './transaction_link';
import { Fill, Market, OrderSide, RelayerFill, Token } from './types';

export const buildFill = (
    log: LogWithDecodedArgs<ExchangeFillEventArgs>,
    knownTokens: KnownTokens,
    markets: Market[] | null,
): Fill => {
    const { args } = log;
    const side: OrderSide = getOrderSideFromFillEvent(knownTokens, log, markets);
    let baseTokenAddress: string;
    let quoteTokenAddress: string;
    let baseToken: Token;
    let quoteToken: Token;

    quoteTokenAddress =
        side === OrderSide.Buy
            ? assetDataUtils.decodeERC20AssetData(args.takerAssetData).tokenAddress
            : assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress;

    baseTokenAddress =
        side === OrderSide.Buy
            ? assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress
            : assetDataUtils.decodeERC20AssetData(args.takerAssetData).tokenAddress;

    baseToken = knownTokens.getTokenByAddress(baseTokenAddress);
    quoteToken = knownTokens.getTokenByAddress(quoteTokenAddress);

    const amountQuote = side === OrderSide.Buy ? args.takerAssetFilledAmount : args.makerAssetFilledAmount;
    const amountBase = side === OrderSide.Buy ? args.makerAssetFilledAmount : args.takerAssetFilledAmount;

    const baseDecimalsPerToken = new BigNumber(10).pow(baseToken.decimals);
    const amountBaseUnits = amountBase.div(baseDecimalsPerToken);
    const quoteDecimalsPerToken = new BigNumber(10).pow(quoteToken.decimals);
    const amountQuoteUnits = amountQuote.div(quoteDecimalsPerToken);
    const price = amountQuoteUnits.div(amountBaseUnits).toString();
    const market = marketToStringFromTokens(baseToken, quoteToken);

    return {
        id: `${log.transactionHash}-${log.logIndex}`,
        amountBase,
        amountQuote,
        side,
        price,
        timestamp: new Date(),
        tokenBase: baseToken,
        tokenQuote: quoteToken,
        makerAddress: args.makerAddress,
        takerAddress: args.takerAddress,
        market,
    };
};

export const getTransactionHashFromFill = (fill: Fill): string => {
    return fill.id.slice(0, 66);
};

export const getEtherscanUrlForFillTx = (fill: Fill): string => {
    const hash = getTransactionHashFromFill(fill);
    return getTransactionLink(hash);
};

export const mapRelayerFillToFill = (fill: RelayerFill): Fill => {
    const known_tokens = getKnownTokens();
    return {
        id: fill.id,
        amountQuote: new BigNumber(fill.filledTokenQuoteAmount),
        amountBase: new BigNumber(fill.filledTokenBaseAmount),
        tokenQuote: known_tokens.getTokenByAddress(fill.tokenQuoteAddress),
        tokenBase: known_tokens.getTokenByAddress(fill.tokenBaseAddress),
        side: fill.side === 'BUY' ? OrderSide.Buy : OrderSide.Sell,
        price: fill.price,
        timestamp: new Date(Number(fill.created_at)),
        makerAddress: fill.makerAddress,
        takerAddress: fill.takerAddress,
        market: fill.pair,
    };
};
