import { StoreState } from './types';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getKnownTokens = (state: StoreState) => state.blockchain.knownTokens;
export const getWeb3State = (state: StoreState) => state.blockchain.web3State;
export const getWethBalance = (state: StoreState) => state.blockchain.wethBalance;
