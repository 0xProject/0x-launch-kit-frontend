import { BigNumber, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { RouterState } from 'connected-react-router';

export interface TabItem {
    active: boolean;
    onClick: any;
    text: string;
}

export interface Token {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
}

export interface TokenBalance {
    balance: BigNumber;
    isUnlocked: boolean;
    token: Token;
}

export enum Web3State {
    Done,
    Error,
    Loading,
}

export interface Web3DataWrapper {
    readonly blockchainState: BlockchainState;
    readonly relayerState: RelayerState;
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethBalance: BigNumber;
    readonly networkId: number;
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

export enum OrderSide {
    Sell,
    Buy,
}

export interface UIOrder {
    rawOrder: SignedOrder;
    side: OrderSide;
    size: BigNumber;
    filled: BigNumber;
    price: BigNumber;
    status: OrderStatus;
}

export interface OrderBookItem {
    side: OrderSide;
    size: BigNumber;
    price: BigNumber;
}

export interface OrderBook {
    buyOrders: OrderBookItem[];
    sellOrders: OrderBookItem[];
    mySizeOrders: OrderBookItem[];
    spread: BigNumber;
}
