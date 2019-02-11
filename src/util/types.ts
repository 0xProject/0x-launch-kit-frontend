import { BigNumber, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { RouterState } from 'connected-react-router';

export interface Token {
    address: string;
    symbol: string;
    decimals: number;
}

export interface TokenBalance {
    token: Token;
    balance: BigNumber;
}

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

export interface RelayerState {
    readonly orders: UIOrder[];
    readonly userOrders: UIOrder[];
    readonly selectedToken: Token | null;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
    readonly relayer: RelayerState;
}

export enum UIOrderSide { Sell, Buy }

export interface UIOrder {
    rawOrder: SignedOrder;
    side: UIOrderSide;
    size: BigNumber;
    filled: BigNumber;
    price: BigNumber;
    status: OrderStatus;
}

export interface OrderBookItem {
    side: UIOrderSide;
    size: BigNumber;
    price: BigNumber;
}

export interface OrderBook {
    buyOrders: OrderBookItem[];
    sellOrders: OrderBookItem[];
    spread: BigNumber;
}
