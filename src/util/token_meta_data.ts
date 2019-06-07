import { NETWORK_ID } from '../common/constants';
import { TokenMetaData } from '../common/tokens_meta_data';

import { Token, TokenSymbol } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (tokensMetaData: TokenMetaData[]): Token => {
    const tokenMetadata = tokensMetaData.find(
        tokenMetaData => tokenMetaData.symbol === TokenSymbol.Weth,
    ) as TokenMetaData;
    return {
        address: tokenMetadata.addresses[NETWORK_ID],
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        primaryColor: tokenMetadata.primaryColor,
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
                };
            },
        );
};
