import { BigNumber } from '0x.js';

import { Network } from '../util/types';

export const ERC20_APP_BASE_PATH = '/erc20';
export const ERC721_APP_BASE_PATH = '/erc721';
export const DEFAULT_BASE_PATH = process.env.REACT_APP_DEFAULT_BASE_PATH || ERC20_APP_BASE_PATH;

export const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || 'http://localhost:3001/api/v2';

export const TX_DEFAULTS = {
    gasLimit: 1000000,
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const FEE_RECIPIENT = process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

export const ETH_DECIMALS = 18;

export const UI_DECIMALS_DISPLAYED_ON_STEP_MODALS = 3;
export const UI_DECIMALS_DISPLAYED_SPREAD_PERCENT = 2;
export const UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION = 2;
export const UI_DECIMALS_DISPLAYED_ORDER_SIZE = 0;
export const UI_DECIMALS_DISPLAYED_PRICE_ETH = 7;
export const UI_GENERAL_TITLE = 'Launch Kit';

export const METAMASK_EXTENSION_URL = 'https://metamask.io/';
export const METAMASK_CHROME_EXTENSION_DOWNLOAD_URL =
    'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';

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

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const ONE_MINUTE_MS = 1000 * 60;

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(6);

export const DEFAULT_ESTIMATED_TRANSACTION_TIME_MS = ONE_MINUTE_MS * 2;

export const GIT_COMMIT: string = process.env.REACT_APP_GIT_COMMIT || '';

export const START_BLOCK_LIMIT: number = Number.parseInt(process.env.REACT_APP_START_BLOCK_LIMIT as string, 10) || 1000;

export const LOGGER_ID: string = process.env.REACT_APP_LOGGER_ID || 'veridex';

export const ERC20_THEME_NAME: string = process.env.REACT_APP_ERC20_THEME_NAME || 'DARK_THEME';

export const ERC721_THEME_NAME: string = process.env.REACT_APP_ERC721_THEME_NAME || 'LIGHT_THEME';

export const COLLECTIBLES_SOURCE: string = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'mocked';

export const COLLECTIBLE_NAME: string = process.env.REACT_APP_COLLECTIBLE_NAME || 'Unknown';
export const COLLECTIBLE_DESCRIPTION: string = process.env.REACT_APP_COLLECTIBLE_DESCRIPTION || 'Unknown';

const mockERC721Address = '0x07f96aa816c1f244cbc6ef114bb2b023ba54a2eb'; // Mock ERC721 in ganache
export const COLLECTIBLE_ADDRESS = process.env.REACT_APP_COLLECTIBLE_ADDRESS || mockERC721Address;

export const STEP_MODAL_DONE_STATUS_VISIBILITY_TIME: number =
    Number.parseInt(process.env.REACT_APP_STEP_MODAL_DONE_STATUS_VISIBILITY_TIME as string, 10) || 3500;

export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY;

export const NETWORK_ID: number = Number.parseInt(process.env.REACT_APP_NETWORK_ID as string, 10) || Network.Mainnet;

export const NETWORK_NAME: string = Network[NETWORK_ID];

export const FILLS_LIMIT: number =
    Number.parseInt(process.env.REACT_APP_FILLS_LIMIT as string, 10) || 50;

