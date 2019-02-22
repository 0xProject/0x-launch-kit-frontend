export const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || 'http://localhost:3001/api/v2';

// Must be the same a as the relayer
export const RELAYER_NETWORK_ID: number = Number.parseInt(process.env.REACT_APP_RELAYER_NETWORK_ID as string, 10) || 50;

export const TX_DEFAULTS = {
    gasLimit: 1000000,
};

export const WETH_TOKEN_SYMBOL = 'weth';
