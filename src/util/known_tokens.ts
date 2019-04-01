import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { KNOWN_TOKENS_META_DATA, TokenMetaData } from '../common/tokens_meta_data';

import { getWethTokenFromTokensMetaDataByNetworkId, mapTokensMetaDataToTokenByNetworkId } from './token_meta_data';
import { Market, OrderSide, Token, TokenSymbol } from './types';

export class KnownTokens {
    private readonly _tokens: Token[] = [];
    private readonly _wethToken: Token;

    constructor(networkId: number, knownTokensMetadata: TokenMetaData[]) {
        this._tokens = mapTokensMetaDataToTokenByNetworkId(networkId, knownTokensMetadata).filter(
            token => !isWeth(token.symbol),
        );
        this._wethToken = getWethTokenFromTokensMetaDataByNetworkId(networkId, knownTokensMetadata);
    }

    public getTokenBySymbol = (symbol: string): Token => {
        const symbolInLowerCaseScore = symbol.toLowerCase();
        const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);
        if (!token) {
            if (symbolInLowerCaseScore === TokenSymbol.Weth) {
                return this.getWethToken();
            }
            throw new Error(`Token with symbol ${symbol} not found in known tokens`);
        }
        return token;
    };

    public getTokenByAddress = (address: string): Token => {
        const addressInLowerCase = address.toLowerCase();
        let token = this._tokens.find(t => t.address.toLowerCase() === addressInLowerCase);
        if (!token) {
            // If it's not on the tokens list, we check if it's an wETH token
            // TODO - Maybe the this._tokens could be refactored to also have wETH inside
            token = this._wethToken.address === address ? this._wethToken : undefined;
        }
        if (!token) {
            throw new Error(`Token with address ${address} not found in known tokens`);
        }
        return token;
    };

    public isKnownAddress = (address: string): boolean => {
        if (isWeth(address as TokenSymbol)) {
            return true;
        } else {
            try {
                this.getTokenByAddress(address);
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    /**
     * Checks if a Fill event is valid.
     *
     * A Fill event is considered valid if the order involves two ERC20 tokens whose addresses we know.
     *
     */
    public isValidFillEvent = (fillEvent: LogWithDecodedArgs<ExchangeFillEventArgs>): boolean => {
        const { makerAssetData, takerAssetData } = fillEvent.args;

        if (!isERC20AssetData(makerAssetData) || !isERC20AssetData(takerAssetData)) {
            return false;
        }

        const makerAssetAddress = assetDataUtils.decodeERC20AssetData(makerAssetData).tokenAddress;
        const takerAssetAddress = assetDataUtils.decodeERC20AssetData(takerAssetData).tokenAddress;

        if (!this.isKnownAddress(makerAssetAddress) || !this.isKnownAddress(takerAssetAddress)) {
            return false;
        }

        return true;
    };

    public getWethToken = (): Token => {
        return this._wethToken as Token;
    };

    public getTokens = (): Token[] => {
        return this._tokens;
    };
}

let knownTokens: KnownTokens;
export const getKnownTokens = (
    networkId: number,
    knownTokensMetadata: TokenMetaData[] = KNOWN_TOKENS_META_DATA,
): KnownTokens => {
    if (!knownTokens) {
        knownTokens = new KnownTokens(networkId, knownTokensMetadata);
    }
    return knownTokens;
};

export const getColorBySymbol = (symbol: string): string => {
    const token = KNOWN_TOKENS_META_DATA.find(t => t.symbol === symbol.toLowerCase());
    if (!token) {
        throw new Error(`Token with symbol ${symbol} not found in known tokens`);
    }

    return token.primaryColor;
};

export const isZrx = (token: TokenSymbol): boolean => {
    return token === TokenSymbol.Zrx;
};

export const isWeth = (token: TokenSymbol): boolean => {
    return token === TokenSymbol.Weth;
};

const isERC20AssetData = (assetData: string): boolean => {
    try {
        assetDataUtils.decodeERC20AssetData(assetData);
        return true;
    } catch (e) {
        return false;
    }
};

export const getOrderSideFromFilledEvent = (
    knownToken: KnownTokens,
    fillEvent: LogWithDecodedArgs<ExchangeFillEventArgs>,
    markets: Market[] | null,
    wethAssetData: string,
): OrderSide => {
    const { args } = fillEvent;
    const makerAssetData = args.makerAssetData;
    const takerAssetData = args.takerAssetData;
    const makerTokenAddress = assetDataUtils.decodeERC20AssetData(makerAssetData).tokenAddress;
    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(takerAssetData).tokenAddress;
    let orderSide: OrderSide = OrderSide.Sell;
    if (!knownToken.isValidFillEvent(fillEvent)) {
        throw new Error('The event is not valid');
    }
    // Fallback in case there are not markets
    if (!markets) {
        orderSide = makerAssetData === wethAssetData ? OrderSide.Buy : OrderSide.Sell;
    } else {
        markets.forEach(market => {
            const baseSymbol = market.currencyPair.base;
            const quoteSymbol = market.currencyPair.quote;
            const baseToken = knownToken.getTokenBySymbol(baseSymbol);
            const quoteToken = knownToken.getTokenBySymbol(quoteSymbol);
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
