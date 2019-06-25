import { NETWORK_ID } from '../common/constants';
import { KNOWN_TOKENS_META_DATA, TokenMetaData } from '../common/tokens_meta_data';

import { Token } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (tokensMetaData: TokenMetaData[]): Token => {
    const tokenMetadata = tokensMetaData.find(tokenMetaData => tokenMetaData.symbol === 'weth') as TokenMetaData;
    return {
        address: tokenMetadata.addresses[NETWORK_ID],
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        primaryColor: tokenMetadata.primaryColor,
        icon: tokenMetadata.icon,
    };
};

export const mapTokensMetaDataToTokenByNetworkId = (tokensMetaData: TokenMetaData[]): Token[] => {
    return tokensMetaData
        .filter(tokenMetaData => tokenMetaData.addresses[NETWORK_ID])
        .map(
            (tokenMetaData): Token => {
                return {
                    address: tokenMetaData.addresses[NETWORK_ID],
                    symbol: tokenMetaData.symbol,
                    decimals: tokenMetaData.decimals,
                    name: tokenMetaData.name,
                    primaryColor: tokenMetaData.primaryColor,
                    icon: tokenMetaData.icon,
                };
            },
        );
};

export const tokenToTokenMetaData = (token: Token): TokenMetaData => {
    return getTokenMetaDataFromSymbol(token.symbol);
};

export const getTokenMetaDataFromSymbol = (symbol: string): TokenMetaData => {
    return KNOWN_TOKENS_META_DATA.filter(tokenMetaData => tokenMetaData.symbol === symbol)[0];
};
