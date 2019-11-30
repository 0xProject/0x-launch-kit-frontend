import { assetDataUtils, ExchangeFillEventArgs, LogWithDecodedArgs } from '0x.js';

import { ConfigIEO } from '../common/config';
import { KNOWN_TOKENS_META_DATA } from '../common/tokens_meta_data';
import { KNOWN_TOKENS_IEO_META_DATA, TokenIEOMetaData } from '../common/tokens_meta_data_ieo';

import { getLogger } from './logger';
import { mapTokensBotToTokenIEO, mapTokensIEOMetaDataToTokenByNetworkId } from './token_ieo_meta_data';
import { TokenIEO } from './types';

const logger = getLogger('Tokens::known_tokens .ts');

export class KnownTokensIEO {
    private readonly _tokens: TokenIEO[] = [];
    private readonly _tokensBot: TokenIEO[] = [];

    constructor(knownTokensMetadata: TokenIEOMetaData[]) {
        this._tokens = mapTokensIEOMetaDataToTokenByNetworkId(knownTokensMetadata);
        this._tokensBot = mapTokensBotToTokenIEO(ConfigIEO.getConfigBot().tokens);
    }

    public getTokenBySymbol = (symbol: string): TokenIEO => {
        const symbolInLowerCaseScore = symbol.toLowerCase();
        const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);
        if (!token) {
            const errorMessage = `Token with symbol ${symbol} not found in known tokens`;
            logger.log(errorMessage);
            throw new Error(errorMessage);
        }
        return token;
    };
    public getTokenByName = (name: string): TokenIEO => {
        const nameInLowerCaseScore = name.toLowerCase();
        const token = this._tokens.find(t => t.name.toLowerCase() === nameInLowerCaseScore);
        if (!token) {
            const errorMessage = `Token with symbol ${name} not found in known tokens`;
            logger.log(errorMessage);
            throw new Error(errorMessage);
        }
        return token;
    };

    public getTokenByAddress = (address: string): TokenIEO => {
        const addressInLowerCase = address.toLowerCase();
        const token = this._tokens.find(t => t.address.toLowerCase() === addressInLowerCase);
        if (!token) {
            throw new Error(`Token with address ${address} not found in known tokens`);
        }
        return token;
    };
    public getTokenBotByAddress = (address: string): TokenIEO => {
        const addressInLowerCase = address.toLowerCase();
        const token = this._tokensBot.find(t => t.address.toLowerCase() === addressInLowerCase);
        if (!token) {
            throw new Error(`Token with address ${address} not found in known tokens`);
        }
        return token;
    };
    public getAllTokensByAddress = (address: string): TokenIEO => {
        const addressInLowerCase = address.toLowerCase();
        let token = this._tokensBot.find(t => t.address.toLowerCase() === addressInLowerCase);
        if (!token) {
            token = this._tokens.find(t => t.address.toLowerCase() === addressInLowerCase);
        }
        if (!token) {
            throw new Error(`Token with address ${address} not found in known tokens`);
        }
        return token;
    };

    public getTokenBotByName = (name: string): TokenIEO => {
        const nameInLowerCase = name.toLowerCase();
        const token = this._tokensBot.find(t => t.name.toLowerCase() === nameInLowerCase);
        if (!token) {
            throw new Error(`Token with address ${name} not found in known tokens`);
        }
        return token;
    };
    public getTokenBotBySymbol = (symbol: string): TokenIEO => {
        const symbolInLowerCase = symbol.toLowerCase();
        const token = this._tokensBot.find(t => t.symbol.toLowerCase() === symbolInLowerCase);
        if (!token) {
            throw new Error(`Token with address ${symbol} not found in known tokens`);
        }
        return token;
    };

    public getAllTokensByName = (name: string): TokenIEO => {
        const nameInLowerCase = name.toLowerCase();
        let token = this._tokensBot.find(t => t.name.toLowerCase() === nameInLowerCase);
        if (!token) {
            token = this._tokens.find(t => t.name.toLowerCase() === nameInLowerCase);
        }
        if (!token) {
            throw new Error(`Token with address ${name} not found in known tokens`);
        }
        return token;
    };

    public getTokenByAssetData = (assetData: string): TokenIEO => {
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
    public getTokens = (): TokenIEO[] => {
        return this._tokens;
    };
}

let knownTokensIEO: KnownTokensIEO;
export const getKnownTokensIEO = (
    knownTokensMetadata: TokenIEOMetaData[] = KNOWN_TOKENS_IEO_META_DATA,
): KnownTokensIEO => {
    if (!knownTokensIEO) {
        knownTokensIEO = new KnownTokensIEO(knownTokensMetadata);
    }
    return knownTokensIEO;
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
