import { WETH_TOKEN_SYMBOL } from '../common/constants';
import { TokenMetaData } from '../common/tokens_meta_data';

import { Token } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (
    networkId: number,
    tokensMetaData: TokenMetaData[],
): Token => {
    const tokenMetadata = tokensMetaData.find(
        tokenMetaData => tokenMetaData.symbol === WETH_TOKEN_SYMBOL,
    ) as TokenMetaData;
    return {
        address: tokenMetadata.addresses[networkId],
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
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
                };
            },
        );
};
