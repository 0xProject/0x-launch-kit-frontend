import { Config } from './config';

export interface TokenMetaData {
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
    mainnetAddress?: string;
}

export const KNOWN_TOKENS_META_DATA: TokenMetaData[] = Config.getConfig().tokens;
