import { RouterState } from 'connected-react-router';

export enum Web3State {
    Loading,
    Done,
    Error,
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: Web3State;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
}
