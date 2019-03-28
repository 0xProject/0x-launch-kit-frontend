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
    symbol: TokenSymbol;
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
    readonly currencyPair: CurrencyPair;
    readonly baseToken: Token | null;
    readonly quoteToken: Token | null;
    readonly ethInUsd: BigNumber | null;
    readonly markets: Market[] | null;
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
    ToggleTokenLock = 'ToggleTokenLock',
    BuySellLimit = 'BuySellLimit',
    BuySellMarket = 'BuySellMarket',
}

export interface StepWrapEth {
    kind: StepKind.WrapEth;
    currentWethBalance: BigNumber;
    newWethBalance: BigNumber;
    context: 'order' | 'standalone';
}

export interface StepToggleTokenLock {
    kind: StepKind.ToggleTokenLock;
    token: Token;
    isUnlocked: boolean;
    context: 'order' | 'standalone';
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

export type Step = StepWrapEth | StepToggleTokenLock | StepBuySellLimitOrder | StepBuySellMarket;

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
    filled: BigNumber | null;
    price: BigNumber;
    status: OrderStatus | null;
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
    base: TokenSymbol;
    quote: TokenSymbol;
}

export interface Market {
    currencyPair: CurrencyPair;
    price: BigNumber | null;
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
    id: string;
    kind: NotificationKind.OrderFilled;
    amount: BigNumber;
    token: Token;
    side: OrderSide;
}

export type Notification = CancelOrderNotification | MarketNotification | LimitNotification | OrderFilledNotification;

export enum TokenSymbol {
    Weth = 'weth',
    Zrx = 'zrx',
    Dai = 'dai',
    Mkr = 'mkr',
    Rep = 'rep',
    Dgd = 'dgd',
    Mln = 'mln',
}

export enum OrderType {
    Limit = 'Limit',
    Market = 'Market',
}

export enum ModalDisplay {
    InstallMetamask = 'INSTALL_METAMASK',
    EnablePermissions = 'ACCEPT_PERMISSIONS',
}
