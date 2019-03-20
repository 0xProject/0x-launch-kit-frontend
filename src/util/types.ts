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
    primaryColor: string;
}

export interface TokenBalance {
    balance: BigNumber;
    isUnlocked: boolean;
    token: Token;
}

export enum Web3State {
    Done = 'Done',
    Error = 'Error',
    Loading = 'Loading',
    NotInstalled = 'NotInstalled',
    Locked = 'Locked',
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethTokenBalance: TokenBalance | null;
}

export interface RelayerState {
    readonly orders: UIOrder[];
    readonly userOrders: UIOrder[];
}

export interface UIState {
    readonly notifications: Notification[];
    readonly hasUnreadNotifications: boolean;
    readonly stepsModal: StepsModalState;
}

export interface MarketState {
    currencyPair: CurrencyPair;
    baseToken: Token | null;
    quoteToken: Token | null;
    prices: MarketPriceState;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
    readonly relayer: RelayerState;
    readonly ui: UIState;
    readonly market: MarketState;
}

export enum StepKind {
    WrapEth = 'WrapEth',
    UnlockToken = 'UnlockToken',
    BuySellLimit = 'BuySellLimit',
    BuySellMarket = 'BuySellMarket',
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
    price: BigNumber;
    side: OrderSide;
}

export interface StepBuySellMarket {
    kind: StepKind.BuySellMarket;
    amount: BigNumber;
    side: OrderSide;
    token: Token;
}

export type Step = StepWrapEth | StepUnlockToken | StepBuySellLimitOrder | StepBuySellMarket;

export interface StepsModalState {
    readonly doneSteps: Step[];
    readonly currentStep: Step | null;
    readonly pendingSteps: Step[];
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

export interface CurrencyPair {
    base: string;
    quote: string;
}

export enum NotificationKind {
    CancelOrder = 'CancelOrder',
    Market = 'Market',
    Limit = 'Limit',
    OrderFilled = 'OrderFilled',
}

interface BaseNotification {
    kind: NotificationKind;
    timestamp: Date;
}

interface CancelOrderNotification extends BaseNotification {
    kind: NotificationKind.CancelOrder;
    amount: BigNumber;
    token: Token;
}

interface MarketNotification extends BaseNotification {
    kind: NotificationKind.Market;
    amount: BigNumber;
    token: Token;
    tx: Promise<any>;
    side: OrderSide;
}

interface LimitNotification extends BaseNotification {
    kind: NotificationKind.Limit;
    amount: BigNumber;
    token: Token;
    side: OrderSide;
}

export interface OrderFilledNotification extends BaseNotification {
    kind: NotificationKind.OrderFilled;
    amount: BigNumber;
    token: Token;
    side: OrderSide;
}

export type Notification = CancelOrderNotification | MarketNotification | LimitNotification | OrderFilledNotification;

export interface MarketPrice {
    readonly symbol: string;
    readonly priceUSD: BigNumber;
    readonly priceETHER: BigNumber;
    readonly priceDAI: BigNumber;
    readonly volumeUSD: BigNumber;
    readonly percentChange: BigNumber;
}

export interface MarketPriceState {
    eth: MarketPrice | null;
}
