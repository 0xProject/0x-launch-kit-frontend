import { BigNumber } from '0x.js';

export const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || 'http://localhost:3001/api/v2';

export const MAINNET_ID = 1;

export const ETHERSCAN_MAINNET_URL = 'https://etherscan.io/tx/';
export const ETHERSCAN_KOVAN_URL = 'https://kovan.etherscan.io/tx/';

export const TX_DEFAULTS = {
    gasLimit: 1000000,
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const FEE_RECIPIENT = process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

// these constants should be in wei
export const MAKER_FEE = new BigNumber(process.env.REACT_APP_MAKER_FEE || '1000000000000000000');
export const TAKER_FEE = new BigNumber(process.env.REACT_APP_TAKER_FEE || '100000000000000000');

export const ETH_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

export const ZEROX_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/0x/';

export const CACHE_CHECK_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_CACHE_CHECK_INTERVAL as string, 10) || 60000;

export const UI_DECIMALS_DISPLAYED_ORDER_SIZE = 4;
export const UI_DECIMALS_DISPLAYED_PRICE_ETH = 7;

export const METAMASK_EXTENSION_URL = 'https://metamask.io/';

// Default value is disabled
export const UI_UPDATE_CHECK_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_UI_UPDATE_CHECK_INTERVAL as string, 10) || 0;

// Default value is disabled
export const UPDATE_ETHER_PRICE_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_UPDATE_ETHER_PRICE_INTERVAL as string, 10) || 0;

export const NOTIFICATIONS_LIMIT: number =
    Number.parseInt(process.env.REACT_APP_NOTIFICATIONS_LIMIT as string, 10) || 20;

export const ETH_GAS_STATION_API_BASE_URL = 'https://ethgasstation.info';

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const ONE_MINUTE_MS = 1000 * 60;

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.mul(6);

export const DEFAULT_ESTIMATED_TRANSACTION_TIME_MS = ONE_MINUTE_MS * 2;

export const GIT_COMMIT: string = process.env.REACT_APP_GIT_COMMIT || '';

export const START_BLOCK_LIMIT: number = Number.parseInt(process.env.REACT_APP_START_BLOCK_LIMIT as string, 10) || 1000;

export const LOGGER_ID: string = process.env.REACT_APP_LOGGER_ID || '0x-launch-kit-frontend';

export const THEME_NAME: string = process.env.REACT_APP_THEME_NAME || 'DEFAULT_THEME';

export const SHOULD_ENABLE_NO_METAMASK_PROMPT: boolean = process.env.REACT_APP_ENABLE_NO_METAMASK_PROMPT
    ? process.env.REACT_APP_ENABLE_NO_METAMASK_PROMPT === 'true'
    : process.env.NODE_ENV === 'development';
