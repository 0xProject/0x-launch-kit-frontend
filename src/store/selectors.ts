import { StoreState } from './types';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
