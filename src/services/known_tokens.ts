import { WETH_TOKEN_SYMBOL } from '../common/constants';
import { KNOWN_TOKENS_META_DATA } from '../common/tokens_meta_data';
import {
    getWethTokenFromTokensMetaDataByNetworkId,
    mapTokensMetaDataToTokenByNetworkId,
} from '../util/token_meta_data';
import { Token } from '../util/types';

export class KnownTokens {
    private readonly _tokens: Token[] = [];
    private readonly _wethToken: Token | null;

    constructor(networkId: number) {
        this._tokens = mapTokensMetaDataToTokenByNetworkId(networkId, KNOWN_TOKENS_META_DATA).filter(
            token => token.symbol !== WETH_TOKEN_SYMBOL,
        );
        this._wethToken = getWethTokenFromTokensMetaDataByNetworkId(networkId, KNOWN_TOKENS_META_DATA);
    }

    public getTokenBySymbol = (symbol: string): Token => {
        const symbolInLowerCaseScore = symbol.toLowerCase();
        const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found in known tokens`);
        }
        return token;
    };

    public getWethToken = (): Token => {
        return this._wethToken as Token;
    };

    public getTokens = (): Token[] => {
        return this._tokens;
    };
}

let knownTokens: KnownTokens;
export const getKnownTokens = (networkId: number = 50): KnownTokens => {
    if (!knownTokens) {
        knownTokens = new KnownTokens(networkId);
    }
    return knownTokens;
};
