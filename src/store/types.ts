import { BigNumber } from '0x.js';
import { RouterState } from 'connected-react-router';

import { TokenBalance } from '../util/types';

export enum Web3State {
    Loading,
    Done,
    Error,
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: Web3State;
    readonly knownTokens: TokenBalance[];
    readonly wethBalance: BigNumber;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
}
