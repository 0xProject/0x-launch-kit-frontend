export const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || 'http://localhost:3001/api/v2';

// Must be the same a as the relayer
export const RELAYER_NETWORK_ID: number = Number.parseInt(process.env.REACT_APP_RELAYER_NETWORK_ID as string, 10) || 50;

export const TX_DEFAULTS = {
    gasLimit: 1000000,
};

export const WETH_TOKEN_SYMBOL = 'weth';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const FEE_RECIPIENT = process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

export const MAKER_FEE = process.env.REACT_APP_MAKER_FEE || '0';
export const TAKER_FEE = process.env.REACT_APP_TAKER_FEE || '0';

export const UI_UPDATE_CHECK_INTERVAL: number =
    Number.parseInt(process.env.REACT_APP_UI_UPDATE_CHECK_INTERVAL as string, 10) || 5000;
