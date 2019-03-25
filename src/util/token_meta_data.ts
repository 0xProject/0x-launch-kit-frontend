import { TokenMetaData } from '../common/tokens_meta_data';

import { Token, TokenSymbol } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (
    networkId: number,
    tokensMetaData: TokenMetaData[],
): Token => {
    const tokenMetadata = tokensMetaData.find(
        tokenMetaData => tokenMetaData.symbol === TokenSymbol.Weth,
    ) as TokenMetaData;
    return {
        address: tokenMetadata.addresses[networkId],
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        primaryColor: tokenMetadata.primaryColor,
    };
};

export const mapTokensMetaDataToTokenByNetworkId = (networkId: number, tokensMetaData: TokenMetaData[]): Token[] => {
    return tokensMetaData
        .filter(tokenMetaData => tokenMetaData.addresses[networkId])
        .map(
            (tokenMetaData): Token => {
                return {
                    address: tokenMetaData.addresses[networkId],
                    symbol: tokenMetaData.symbol,
                    decimals: tokenMetaData.decimals,
                    name: tokenMetaData.name,
                    primaryColor: tokenMetaData.primaryColor,
                };
            },
        );
};
