import { NETWORK_ID } from '../common/constants';
import { TokenMetaData } from '../common/tokens_meta_data';

import { Token, TokenSymbol } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (tokensMetaData: TokenMetaData[]): Token => {
    const tokenMetadata = tokensMetaData.find(
        tokenMetaData => tokenMetaData.symbol === TokenSymbol.Weth,
    ) as TokenMetaData;
    if (tokenMetadata.id) {
        return {
            address: tokenMetadata.addresses[NETWORK_ID],
            symbol: tokenMetadata.symbol,
            decimals: tokenMetadata.decimals,
            name: tokenMetadata.name,
            primaryColor: tokenMetadata.primaryColor,
            id: tokenMetadata.id,
        };
    } else {
        return {
            address: tokenMetadata.addresses[NETWORK_ID],
            symbol: tokenMetadata.symbol,
            decimals: tokenMetadata.decimals,
            name: tokenMetadata.name,
            primaryColor: tokenMetadata.primaryColor,
        };
    }
};

export const mapTokensMetaDataToTokenByNetworkId = (tokensMetaData: TokenMetaData[]): Token[] => {
    return tokensMetaData
        .filter(tokenMetaData => tokenMetaData.addresses[NETWORK_ID])
        .map(
            (tokenMetaData): Token => {
                if (tokenMetaData.id) {
                    return {
                        address: tokenMetaData.addresses[NETWORK_ID],
                        symbol: tokenMetaData.symbol,
                        decimals: tokenMetaData.decimals,
                        name: tokenMetaData.name,
                        primaryColor: tokenMetaData.primaryColor,
                        id: tokenMetaData.id,
                    };
                } else {
                    return {
                        address: tokenMetaData.addresses[NETWORK_ID],
                        symbol: tokenMetaData.symbol,
                        decimals: tokenMetaData.decimals,
                        name: tokenMetaData.name,
                        primaryColor: tokenMetaData.primaryColor,
                    };
                }
            },
        );
};
