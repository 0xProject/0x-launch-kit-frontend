import { BigNumber } from '0x.js';

export enum MARKETPLACES {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
}

export const ERC20_APP_BASE_PATH = '/erc20';
export const ERC721_APP_BASE_PATH = '/erc721';
export const DEFAULT_BASE_PATH = process.env.REACT_APP_DEFAULT_BASE_PATH || ERC20_APP_BASE_PATH;

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

export const ETH_DECIMALS = 18;

export const ETH_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

export const ZEROX_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/0x/';

export const CACHE_CHECK_INTERVAL: number = process.env.REACT_APP_CACHE_CHECK_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_CACHE_CHECK_INTERVAL as string, 10)
    : 60000;

export const UI_DECIMALS_DISPLAYED_SPREAD_PERCENT = 2;
export const UI_DECIMALS_DISPLAYED_ORDER_SIZE = 4;
export const UI_DECIMALS_DISPLAYED_PRICE_ETH = 7;

export const METAMASK_EXTENSION_URL = 'https://metamask.io/';

// Default value is enabled, 0 is disabled
export const UI_UPDATE_CHECK_INTERVAL: number = process.env.REACT_APP_UI_UPDATE_CHECK_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_UI_UPDATE_CHECK_INTERVAL as string, 10)
    : 5000;

// Default value is enabled, 0 is disabled
export const UPDATE_ETHER_PRICE_INTERVAL: number = process.env.REACT_APP_UPDATE_ETHER_PRICE_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_UPDATE_ETHER_PRICE_INTERVAL as string, 10)
    : 3600000;

export const NOTIFICATIONS_LIMIT: number =
    Number.parseInt(process.env.REACT_APP_NOTIFICATIONS_LIMIT as string, 10) || 20;

export const ETH_GAS_STATION_API_BASE_URL = 'https://ethgasstation.info';

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const ONE_MINUTE_MS = 1000 * 60;

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(6);

export const DEFAULT_ESTIMATED_TRANSACTION_TIME_MS = ONE_MINUTE_MS * 2;

export const GIT_COMMIT: string = process.env.REACT_APP_GIT_COMMIT || '';

export const START_BLOCK_LIMIT: number = Number.parseInt(process.env.REACT_APP_START_BLOCK_LIMIT as string, 10) || 1000;

export const LOGGER_ID: string = process.env.REACT_APP_LOGGER_ID || '0x-launch-kit-frontend';

export const ERC20_THEME_NAME: string = process.env.REACT_APP_ERC20_THEME_NAME || 'DARK_THEME';

export const ERC721_THEME_NAME: string = process.env.REACT_APP_ERC721_THEME_NAME || 'LIGHT_THEME';

export const SHOULD_ENABLE_NO_METAMASK_PROMPT: boolean = process.env.REACT_APP_ENABLE_NO_METAMASK_PROMPT
    ? process.env.REACT_APP_ENABLE_NO_METAMASK_PROMPT === 'true'
    : process.env.NODE_ENV === 'development';

export const COLLECTIBLES_SOURCE: string = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'mocked';

export const COLLECTIBLE_NAME: string = process.env.REACT_APP_COLLECTIBLE_NAME || 'Unknown';

export const COLLECTIBLE_CONTRACT_ADDRESSES: { [key: number]: string } = {
    1: '0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d', // mainnet axie
    4: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf', // rinkeby cryptokitties
    50: '0x07f96aa816c1f244cbc6ef114bb2b023ba54a2eb', // ganache mock erc721
};

export const STEP_MODAL_DONE_STATUS_VISIBILITY_TIME: number =
    Number.parseInt(process.env.REACT_APP_STEP_MODAL_DONE_STATUS_VISIBILITY_TIME as string, 10) || 3500;
