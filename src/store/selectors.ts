import { StoreState } from '../util/types';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getKnownTokens = (state: StoreState) => state.blockchain.knownTokens;
export const getWethBalance = (state: StoreState) => state.blockchain.wethBalance;
export const getOrders = (state: StoreState) => state.relayer.orders;
export const getSelectedToken = (state: StoreState) => state.relayer.selectedToken;
