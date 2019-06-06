import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { KNOWN_TOKENS_META_DATA, TokenMetaData } from '../common/tokens_meta_data';
import { getLogger } from '../util/logger';

import { getWethTokenFromTokensMetaDataByNetworkId, mapTokensMetaDataToTokenByNetworkId } from './token_meta_data';
import { Token } from './types';

const logger = getLogger('Tokens::known_tokens .ts');

export class KnownTokens {
    private readonly _tokens: Token[] = [];
    private readonly _wethToken: Token;

    constructor(knownTokensMetadata: TokenMetaData[]) {
        this._tokens = mapTokensMetaDataToTokenByNetworkId(knownTokensMetadata).filter(token => !isWeth(token.symbol));
        this._wethToken = getWethTokenFromTokensMetaDataByNetworkId(knownTokensMetadata);
    }

    public getTokenBySymbol = (symbol: string): Token => {
        const symbolInLowerCaseScore = symbol.toLowerCase();
        const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);
        if (!token) {
            if (symbolInLowerCaseScore === 'weth') {
                return this.getWethToken();
            }
            const errorMessage = `Token with symbol ${symbol} not found in known tokens`;
            logger.log(errorMessage);
            throw new Error(errorMessage);
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

    public getTokenByAssetData = (assetData: string): Token => {
        const tokenAddress = assetDataUtils.decodeERC20AssetData(assetData).tokenAddress;
        return this.getTokenByAddress(tokenAddress);
    };

    public isKnownAddress = (address: string): boolean => {
        try {
            this.getTokenByAddress(address);
            return true;
        } catch (e) {
            return false;
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
export const getKnownTokens = (knownTokensMetadata: TokenMetaData[] = KNOWN_TOKENS_META_DATA): KnownTokens => {
    if (!knownTokens) {
        knownTokens = new KnownTokens(knownTokensMetadata);
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

export const isZrx = (token: string): boolean => {
    return token === 'zrx';
};

export const isWeth = (token: string): boolean => {
    return token === 'weth';
};

export const isERC20AssetData = (assetData: string): boolean => {
    try {
        assetDataUtils.decodeERC20AssetData(assetData);
        return true;
    } catch (e) {
        return false;
    }
};
