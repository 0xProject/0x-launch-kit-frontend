import { NETWORK_ID, UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION } from '../common/constants';
import { TokenIEOMetaData } from '../common/tokens_meta_data_ieo';

import { AssetBot, TokenIEO } from './types';

export const mapTokensIEOMetaDataToTokenByNetworkId = (tokensMetaData: TokenIEOMetaData[]): TokenIEO[] => {
    return tokensMetaData
        .filter(tokenMetaData => tokenMetaData.addresses[NETWORK_ID])
        .map(
            (tokenMetaData): TokenIEO => {
                return {
                    address: tokenMetaData.addresses[NETWORK_ID],
                    symbol: tokenMetaData.symbol,
                    decimals: tokenMetaData.decimals,
                    name: tokenMetaData.name,
                    primaryColor: tokenMetaData.primaryColor,
                    icon: tokenMetaData.icon,
                    displayDecimals:
                        tokenMetaData.displayDecimals !== undefined
                            ? tokenMetaData.displayDecimals
                            : UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
                    id: tokenMetaData.id || undefined,
                    c_id: tokenMetaData.c_id || undefined,
                    minAmount: tokenMetaData.minAmount || 0,
                    maxAmount: tokenMetaData.maxAmount || undefined,
                    precision:
                        tokenMetaData.precision !== undefined
                            ? tokenMetaData.precision
                            : UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
                    website: tokenMetaData.website || undefined,
                    description: tokenMetaData.description || undefined,
                    verisafe_sticker: tokenMetaData.verisafe_sticker || undefined,
                    owners: tokenMetaData.owners || [],
                    social: {
                        facebook_url: (tokenMetaData.social && tokenMetaData.social.facebook_url) || undefined,
                        reddit_url: (tokenMetaData.social && tokenMetaData.social.reddit_url) || undefined,
                        twitter_url: (tokenMetaData.social && tokenMetaData.social.twitter_url) || undefined,
                        telegram_url: (tokenMetaData.social && tokenMetaData.social.telegram_url) || undefined,
                        discord_url: (tokenMetaData.social && tokenMetaData.social.discord_url) || undefined,
                        bitcointalk_url: (tokenMetaData.social && tokenMetaData.social.bitcointalk_url) || undefined,
                        youtube_url: (tokenMetaData.social && tokenMetaData.social.youtube_url) || undefined,
                        medium_url: (tokenMetaData.social && tokenMetaData.social.medium_url) || undefined,
                    },
                    feePercentage: tokenMetaData.feePercentage || undefined,
                    endDate: tokenMetaData.endDate || undefined,
                };
            },
        );
};

export const mapTokensBotToTokenIEO = (assetTokens: AssetBot[]): TokenIEO[] => {
    return assetTokens.map(
        (asset): TokenIEO => {
            return {
                address: asset.contract,
                symbol: asset.ticker,
                decimals: asset.decimals,
                name: asset.name,
                primaryColor: '#000',
                icon: undefined,
                displayDecimals: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
                id: undefined,
                c_id: undefined,
                minAmount: 0,
                maxAmount: undefined,
                precision: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
                website: undefined,
                description: undefined,
                verisafe_sticker: undefined,
                owners: asset.whitelistAddresses,
                social: {
                    facebook_url: undefined,
                    reddit_url: undefined,
                    twitter_url: undefined,
                    telegram_url: undefined,
                    discord_url: undefined,
                    bitcointalk_url: undefined,
                    youtube_url: undefined,
                    medium_url: undefined,
                },
                feePercentage: asset.feePercentage,
                endDate: undefined,
            };
        },
    );
};
