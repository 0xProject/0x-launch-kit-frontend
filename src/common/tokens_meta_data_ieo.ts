import { ConfigIEO } from './config';

export interface TokenIEOMetaData {
    addresses: { [key: number]: string };
    symbol: string;
    decimals: number;
    name: string;
    primaryColor: string;
    id?: string;
    c_id?: string;
    icon?: string;
    displayDecimals?: number;
    minAmount?: number;
    maxAmount?: number;
    precision?: number;
    description?: string;
    website?: string;
    verisafe_sticker?: string;
    owners?: string[];
    social?: {
        facebook_url?: string;
        reddit_url?: string;
        twitter_url?: string;
        telegram_url?: string;
        discord_url?: string;
        bitcointalk_url?: string;
        youtube_url?: string;
        medium_url?: string;
    };
    feePercentage?: string;
    endDate?: number | string;
}

export const KNOWN_TOKENS_IEO_META_DATA: TokenIEOMetaData[] = ConfigIEO.getConfig().tokens;
