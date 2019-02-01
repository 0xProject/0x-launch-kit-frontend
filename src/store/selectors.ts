import { StoreState } from './types';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getKnownTokens = (state: StoreState) => state.blockchain.knownTokens;
export const getWethBalance = (state: StoreState) => state.blockchain.wethBalance;
