import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs, BigNumber } from '0x.js';

import { KnownTokens } from './known_tokens';
import { getOrderSideFromFillEvent } from './notifications';
import { getTransactionLink } from './transaction_link';
import { Fill, Market, OrderSide, Token } from './types';


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


    quoteTokenAddress = side === OrderSide.Buy
        ? assetDataUtils.decodeERC20AssetData(args.takerAssetData).tokenAddress
        : assetDataUtils.decodeERC20AssetData(args.makerAssetData).tokenAddress;

    baseTokenAddress = side === OrderSide.Buy
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
    return {
        id: `${log.transactionHash}-${log.logIndex}`,
        amountBase,
        amountQuote,
        side,
        price,
        timestamp: new Date(),
        tokenBase: baseToken,
        tokenQuote: quoteToken,
    };
};

export const getTransactionHashFromFill = (fill: Fill): string => {
    return fill.id.slice(0, 66);
};

export const getEtherscanUrlForFillTx = (fill: Fill): string => {
    const hash = getTransactionHashFromFill(fill);
    return getTransactionLink(hash);
};