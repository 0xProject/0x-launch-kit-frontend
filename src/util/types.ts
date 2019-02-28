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

export enum StepKind {
    WrapEth,
    UnlockToken,
    BuySellLimit,
    Loading,
    Success,
}

export interface StepWrapEth {
    kind: StepKind.WrapEth;
    amount: BigNumber;
}

export interface StepUnlockToken {
    kind: StepKind.UnlockToken;
    token: Token;
}

export interface StepBuySellLimitOrder {
    kind: StepKind.BuySellLimit;
    amount: BigNumber;
    price: number;
    side: OrderSide;
}

export interface StepLoading {
    kind: StepKind.Loading;
    message: string;
}

export interface StepSuccess {
    kind: StepKind.Success;
    message: string;
}

export type Step = StepWrapEth | StepUnlockToken | StepBuySellLimitOrder | StepLoading | StepSuccess;

export interface StepsModalState {
    readonly isVisible: boolean;
    readonly doneSteps: Step[];
    readonly currentStep: Step | null;
    readonly pendingSteps: Step[];
    readonly transactionPromise: Promise<any> | null;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
    readonly relayer: RelayerState;
    readonly stepsModal: StepsModalState;
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
