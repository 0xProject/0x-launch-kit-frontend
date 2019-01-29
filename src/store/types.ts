import { RouterState } from 'connected-react-router';

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: string;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
}
