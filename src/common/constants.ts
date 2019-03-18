import { BigNumber } from '0x.js';

export const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || 'http://localhost:3001/api/v2';

// Must be the same a as the relayer
export const RELAYER_NETWORK_ID: number = Number.parseInt(process.env.REACT_APP_RELAYER_NETWORK_ID as string, 10) || 50;

export const TX_DEFAULTS = {
    gasLimit: 1000000,
};

export const WETH_TOKEN_SYMBOL = 'weth';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const FEE_RECIPIENT = process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

// these constants should be in wei
export const MAKER_FEE = new BigNumber(process.env.REACT_APP_MAKER_FEE || '1000000000000000000');
export const TAKER_FEE = new BigNumber(process.env.REACT_APP_TAKER_FEE || '100000000000000000');

export const ETH_MARKET_PRICE_API_ENDPOINT =
    process.env.REACT_APP_ETH_MARKET_PRICE_API_ENDPOINT || 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

export const ZEROX_MARKET_PRICE_API_ENDPOINT =
    process.env.REACT_APP_MARKET_PRICE_API_ENDPOINT || 'https://api.coinmarketcap.com/v1/ticker/0x/';

export const CACHE_CHECK_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_CACHE_CHECK_INTERVAL as string, 10) || 60000;

export const UI_UPDATE_CHECK_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_UI_UPDATE_CHECK_INTERVAL as string, 10) || 5000;

export const UI_DECIMALS_DISPLAYED_ORDER_SIZE = 4;
export const UI_DECIMALS_DISPLAYED_PRICE_ETH = 7;

export const METAMASK_USER_DENIED_AUTH = 'User denied Auth';
export const METAMASK_NOT_INSTALLED = 'User does not have metamask installed';

export const METAMASK_EXTENSION_URL = 'https://metamask.io/';
