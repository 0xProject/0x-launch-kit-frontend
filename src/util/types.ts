import { BigNumber, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { RouterState } from 'connected-react-router';
import { ActionCreator, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { TokenMetaData } from '../common/tokens_meta_data';
import { TokenIEOMetaData } from '../common/tokens_meta_data_ieo';
import { ExtraArgument } from '../store/index';
import { ThemeModalStyle, ThemeProperties } from '../themes/commons';

export interface TabItem {
    active: boolean;
    onClick: any;
    text: string;
}

export type Maybe<T> = T | undefined;

export enum Network {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42,
    Ganache = 50,
}

export interface Token {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    primaryColor: string;
    id?: string;
    c_id?: string; // coingecko id
    icon?: string;
    displayDecimals: number;
    minAmount?: number;
    maxAmount?: number;
    precision?: number;
    website?: string;
    description?: string;
    verisafe_sticker?: string;
    price_usd?: BigNumber | null;
    price_usd_24h_change?: BigNumber | null;
}

export interface TokenIEO {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    primaryColor: string;
    id?: string;
    c_id?: string; // coingecko id
    icon?: string;
    displayDecimals: number;
    minAmount?: number;
    maxAmount?: number;
    precision?: number;
    website?: string;
    description?: string;
    verisafe_sticker?: string;
    price_usd?: BigNumber | null;
    price_usd_24h_change?: BigNumber | null;
    owners: string[];
    social: {
        facebook_url?: string;
        reddit_url?: string;
        twitter_url?: string;
        telegram_url?: string;
        discord_url?: string;
        bitcointalk_url?: string;
        youtube_url?: string;
        medium_url?: string;
    };
    feePercentage?: string;
    endDate?: string | number;
}

export interface TokenPrice {
    c_id: string; // coingecko id
    price_usd: BigNumber;
    price_usd_24h_change: BigNumber;
}

export interface TokenBalance {
    balance: BigNumber;
    isUnlocked: boolean;
    token: Token;
}

export interface TokenBalanceIEO {
    balance: BigNumber;
    isUnlocked: boolean;
    token: TokenIEO;
}

export interface SearchTokenBalanceObject {
    tokenBalances: TokenBalance[];
    tokenToFind: Token | null;
    wethTokenBalance: TokenBalance | null;
}

export enum Web3State {
    Done = 'Done',
    Error = 'Error',
    Loading = 'Loading',
    NotInstalled = 'NotInstalled',
    Connect = 'Connect',
    Connecting = 'Connecting',
    Locked = 'Locked',
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly wallet: Wallet | null;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethTokenBalance: TokenBalance | null;
    readonly gasInfo: GasInfo;
    readonly convertBalanceState: ConvertBalanceState;
    readonly tokenBaseIEO: TokenIEO | null;
    readonly tokenBaseBalanceIEO: TokenBalanceIEO | null;
    readonly tokenBalancesIEO: TokenBalanceIEO[];
}

export interface RelayerState {
    readonly orders: UIOrder[];
    readonly userOrders: UIOrder[];
    readonly userIEOOrders?: UIOrder[];
    readonly ieoOrders?: SignedOrder[];
    readonly accountMarketStats?: AccountMarketStat[];
}

export interface UIState {
    readonly notifications: Notification[];
    readonly fills: Fill[];
    readonly marketFills: MarketFill;
    readonly userMarketFills: MarketFill;
    readonly userFills: Fill[];
    readonly hasUnreadNotifications: boolean;
    readonly stepsModal: StepsModalState;
    readonly orderPriceSelected: BigNumber | null;
    readonly sidebarOpen: boolean;
    readonly openFiatOnRampModal: boolean;
}

export interface MarketState {
    readonly currencyPair: CurrencyPair;
    readonly baseToken: Token | null;
    readonly quoteToken: Token | null;
    readonly ethInUsd: BigNumber | null;
    readonly quoteInUsd?: BigNumber | null;
    readonly markets: Market[] | null;
    readonly tokensPrice: TokenPrice[] | null;
}

export interface StoreState {
    readonly router: RouterState;
    readonly blockchain: BlockchainState;
    readonly relayer: RelayerState;
    readonly ui: UIState;
    readonly market: MarketState;
    readonly collectibles: CollectiblesState;
}

export enum StepKind {
    WrapEth = 'WrapEth',
    ToggleTokenLock = 'ToggleTokenLock',
    TransferToken = 'TransferToken',
    BuySellLimit = 'BuySellLimit',
    BuySellLimitMatching = 'BuySellLimitMatching',
    BuySellMarket = 'BuySellMarket',
    UnlockCollectibles = 'UnlockCollectibles',
    SellCollectible = 'SellCollectible',
    BuyCollectible = 'BuyCollectible',
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

export interface StepUnlockCollectibles {
    kind: StepKind.UnlockCollectibles;
    collectible: Collectible;
    isUnlocked: boolean;
}

export interface StepBuySellLimitOrder {
    kind: StepKind.BuySellLimit;
    amount: BigNumber;
    price: BigNumber;
    side: OrderSide;
    token: Token;
    is_ieo?: boolean;
}

export interface StepTransferToken {
    kind: StepKind.TransferToken;
    amount: BigNumber;
    address: string;
    token: Token;
    isEth: boolean;
}

export interface StepBuySellMarket {
    kind: StepKind.BuySellMarket;
    amount: BigNumber;
    side: OrderSide;
    token: Token;
}

export interface StepBuySellLimitMatching {
    kind: StepKind.BuySellLimitMatching;
    amount: BigNumber;
    price: BigNumber;
    price_avg: BigNumber;
    side: OrderSide;
    token: Token;
}

export interface StepSellCollectible {
    kind: StepKind.SellCollectible;
    collectible: Collectible;
    startPrice: BigNumber;
    endPrice: BigNumber | null;
    expirationDate: BigNumber;
    side: OrderSide;
}

export interface StepBuyCollectible {
    kind: StepKind.BuyCollectible;
    order: SignedOrder;
    collectible: Collectible;
}

export type Step =
    | StepWrapEth
    | StepToggleTokenLock
    | StepBuySellLimitOrder
    | StepBuySellMarket
    | StepSellCollectible
    | StepBuyCollectible
    | StepUnlockCollectibles
    | StepBuySellLimitMatching
    | StepTransferToken;

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
    makerFillableAmountInTakerAsset: BigNumber;
    remainingTakerAssetFillAmount: BigNumber;
}

export interface OrderBookItem {
    side: OrderSide;
    size: BigNumber;
    price: BigNumber;
}

export interface Spread {
    absolute: BigNumber;
    percentage: BigNumber;
}

export interface OrderBook {
    buyOrders: OrderBookItem[];
    sellOrders: OrderBookItem[];
    mySizeOrders: OrderBookItem[];
}

export interface CurrencyPair {
    base: string;
    quote: string;
    config: {
        basePrecision: number;
        pricePrecision: number;
        minAmount: number;
        maxAmount: number;
        quotePrecision: number;
    };
}
export interface CurrencyPairMetaData {
    base: string;
    quote: string;
    config?: {
        basePrecision?: number;
        pricePrecision?: number;
        minAmount?: number;
        maxAmount?: number;
        quotePrecision?: number;
    };
}

export interface Market {
    currencyPair: CurrencyPair;
    price: BigNumber | null;
    spreadInPercentage: BigNumber | null;
    bestAsk: BigNumber | null;
    bestBid: BigNumber | null;
}

export enum NotificationKind {
    CancelOrder = 'CancelOrder',
    Market = 'Market',
    Limit = 'Limit',
    OrderFilled = 'OrderFilled',
    TokenTransferred = 'TokenTransferred',
}

export interface Fill {
    id: string;
    amountQuote: BigNumber;
    amountBase: BigNumber;
    tokenQuote: Token;
    tokenBase: Token;
    side: OrderSide;
    price: string;
    timestamp: Date;
    makerAddress: string;
    takerAddress: string;
    market: string;
}

export interface MarketFill {
    [market: string]: Fill[];
}

export interface MarketData {
    bestAsk: null | BigNumber;
    bestBid: null | BigNumber;
    spreadInPercentage: null | BigNumber;
}

interface BaseNotification {
    id: string;
    kind: NotificationKind;
    timestamp: Date;
}

interface TransactionNotification extends BaseNotification {
    tx: Promise<any>;
}

interface CancelOrderNotification extends TransactionNotification {
    kind: NotificationKind.CancelOrder;
    amount: BigNumber;
    token: Token;
}

interface MarketNotification extends TransactionNotification {
    kind: NotificationKind.Market;
    amount: BigNumber;
    token: Token;
    side: OrderSide;
}

interface TransferTokenNotification extends TransactionNotification {
    kind: NotificationKind.TokenTransferred;
    amount: BigNumber;
    token: Token;
    address: string;
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

export type Notification =
    | CancelOrderNotification
    | MarketNotification
    | LimitNotification
    | OrderFilledNotification
    | TransferTokenNotification;

export enum OrderType {
    Limit = 'Limit',
    Market = 'Market',
}

export interface GasInfo {
    gasPriceInWei: BigNumber;
    estimatedTimeMs: number;
}

export enum ModalDisplay {
    InstallMetamask = 'INSTALL_METAMASK',
    EnablePermissions = 'ACCEPT_PERMISSIONS',
    ConnectWallet = 'CONNECT_WALLET',
}

export enum MARKETPLACES {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    LaunchPad = 'LAUNCHPAD',
}

export enum Wallet {
    Network = 'Network',
    Metamask = 'Metamask',
    Portis = 'Portis',
    Torus = 'Torus',
    Fortmatic = 'Fortmatic',
    WalletConnect = 'WalletConnect',
    Coinbase = 'Coinbase Wallet',
    Enjin = 'Enjin Wallet',
    Cipher = 'Cipher Wallet',
    Trust = 'Trust Wallet',
}

export interface Collectible {
    tokenId: string;
    name: string;
    color: string;
    image: string;
    currentOwner: string;
    assetUrl: string;
    description: string;
    order: SignedOrder | null;
}

export enum AllCollectiblesFetchStatus {
    Request = 'Request',
    Success = 'Success',
}

export enum ConvertBalanceState {
    Failure = 'Failure',
    Request = 'Request',
    Success = 'Success',
}

export interface CollectiblesState {
    readonly allCollectibles: { [tokenId: string]: Collectible };
    readonly allCollectiblesFetchStatus: AllCollectiblesFetchStatus;
    readonly collectibleSelected: Collectible | null;
}

export interface CollectibleMetadataSource {
    fetchAllUserCollectiblesAsync(userAddress: string): Promise<Collectible[]>;
    fetchCollectiblesAsync(tokenIds: string[]): Promise<Collectible[]>;
}

export type ThunkCreator<R = Promise<any>> = ActionCreator<ThunkAction<R, StoreState, ExtraArgument, AnyAction>>;

export enum ButtonVariant {
    Balance = 'balance',
    Buy = 'buy',
    Error = 'error',
    Primary = 'primary',
    Quaternary = 'quaternary',
    Secondary = 'secondary',
    Sell = 'sell',
    Tertiary = 'tertiary',
    Portis = 'portis',
    Torus = 'torus',
    Fortmatic = 'fortmatic',
}

export enum ButtonIcons {
    Warning = 'warning',
}

export interface Filter {
    text: string;
    value: null | string;
}

export interface PartialTheme {
    componentsTheme?: Partial<ThemeProperties>;
    modalTheme?: Partial<ThemeModalStyle>;
}

export interface GeneralConfig {
    title?: string;
    icon?: string;
    social?: {
        facebook_url?: string;
        reddit_url?: string;
        twitter_url?: string;
        telegram_url?: string;
        discord_url?: string;
        bitcointalk_url?: string;
        youtube_url?: string;
        medium_url?: string;
    };
}

interface WalletsConfig {
    metamask: boolean;
    fortmatic: boolean;
    portis: boolean;
    torus: boolean;
}

export interface ConfigFile {
    tokens: TokenMetaData[];
    pairs: CurrencyPairMetaData[];
    marketFilters?: Filter[];
    wallets?: WalletsConfig;
    theme?: PartialTheme;
    general?: GeneralConfig;
}

export interface ConfigFileIEO {
    tokens: TokenIEOMetaData[];
}

export enum Browser {
    Chrome = 'CHROME',
    Firefox = 'FIREFOX',
    Opera = 'OPERA',
    Safari = 'SAFARI',
    Edge = 'EDGE',
    Other = 'OTHER',
}

export enum OperatingSystem {
    Android = 'ANDROID',
    iOS = 'IOS', // tslint:disable-line:enum-naming
    Mac = 'MAC',
    Windows = 'WINDOWS',
    WindowsPhone = 'WINDOWS_PHONE',
    Linux = 'LINUX',
    Other = 'OTHER',
}

export enum ProviderType {
    Parity = 'PARITY',
    MetaMask = 'META_MASK',
    Mist = 'MIST',
    CoinbaseWallet = 'COINBASE_WALLET',
    EnjinWallet = 'ENJIN_WALLET',
    Cipher = 'CIPHER',
    TrustWallet = 'TRUST_WALLET',
    Opera = 'OPERA',
    Fallback = 'FALLBACK',
    // tslint:disable-next-line: max-file-line-count
}

export interface AccountMarketStat {
    pair: string;
    address: string;
    totalAmountQuote: string;
    totalAmountBase: string;
    totalMakerFeePaid?: string;
    totalTakerFeePaid?: string;
    totalClosedOrders: number;
    // tslint:disable-next-line: max-file-line-count
}
