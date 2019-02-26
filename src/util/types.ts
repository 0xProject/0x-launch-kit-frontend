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

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethBalance: BigNumber;
}

export interface RelayerState {
    readonly orders: UIOrder[];
    readonly userOrders: UIOrder[];
    readonly selectedToken: Token | null;
}

export enum TransactionStepKind {
    WrapEth,
    UnlockToken,
    BuySellLimit,
}

export interface TransactionStepWrapEth {
    kind: TransactionStepKind.WrapEth;
    amount: BigNumber;
}

export interface TransactionStepUnlockToken {
    kind: TransactionStepKind.UnlockToken;
    token: Token;
}

export interface TransactionStepBuySellLimitOrder {
    kind: TransactionStepKind.BuySellLimit;
    amount: BigNumber;
    price: number;
    side: OrderSide;
}

export type TransactionStep = TransactionStepWrapEth | TransactionStepUnlockToken | TransactionStepBuySellLimitOrder;

export interface TransactionStepsModalState {
    readonly isVisible: boolean;
    readonly doneSteps: TransactionStep[];
    readonly currentStep: TransactionStep | null;
    readonly pendingSteps: TransactionStep[];
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
    readonly relayer: RelayerState;
    readonly transactionStepsModal: TransactionStepsModalState;
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
    spread: BigNumber;
}
