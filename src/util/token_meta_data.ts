import { NETWORK_ID } from '../common/constants';
import { TokenMetaData } from '../common/tokens_meta_data';

import { Token } from './types';

export const getWethTokenFromTokensMetaDataByNetworkId = (tokensMetaData: TokenMetaData[]): Token => {
    const tokenMetaData = tokensMetaData.find(t => t.symbol === 'weth');
    if (!tokenMetaData) {
        throw new Error('WETH Token MetaData not found');
    }
    return {
        address: tokenMetaData.addresses[NETWORK_ID],
        symbol: tokenMetaData.symbol,
        decimals: tokenMetaData.decimals,
        name: tokenMetaData.name,
        primaryColor: tokenMetaData.primaryColor,
        icon: tokenMetaData.icon,
        displayDecimals: tokenMetaData.displayDecimals || 2,
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
                    displayDecimals: tokenMetaData.displayDecimals || 2,
                };
            },
        );
};
