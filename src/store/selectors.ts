import { BigNumber, OrderStatus } from '0x.js';
import { createSelector } from 'reselect';

import {
    ERC20_APP_BASE_PATH,
    ERC721_APP_BASE_PATH,
    INSTANT_APP_BASE_PATH,
    LAUNCHPAD_APP_BASE_PATH,
    MARGIN_APP_BASE_PATH,
    USE_RELAYER_MARKET_UPDATES,
} from '../common/constants';
import { isWeth } from '../util/known_tokens';
import {
    getLastPrice,
    getTodayClosedOrdersFromFills,
    getTodayHighPriceFromFills,
    getTodayLowerPriceFromFills,
    getTodayVolumeFromFills,
    marketToString,
} from '../util/markets';
import {
    Collectible,
    CurrencyPair,
    Fill,
    MarketFill,
    MARKETPLACES,
    OrderBook,
    OrderSide,
    RelayerMarketStats,
    SearchTokenBalanceObject,
    StoreState,
    Token,
    TokenBalance,
    Web3State,
} from '../util/types';
import { mergeByPrice } from '../util/ui_orders';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getTokenBalances = (state: StoreState) => state.blockchain.tokenBalances;
export const getBaseTokenIEO = (state: StoreState) => state.blockchain.tokenBaseIEO;
export const getBaseTokenBalanceIEO = (state: StoreState) => state.blockchain.tokenBaseBalanceIEO;
export const getTokenBalancesIEO = (state: StoreState) => state.blockchain.tokenBalancesIEO;
export const getWeb3State = (state: StoreState) => state.blockchain.web3State;
export const getWallet = (state: StoreState) => state.blockchain.wallet;
export const getEthBalance = (state: StoreState) => state.blockchain.ethBalance;
export const getWethTokenBalance = (state: StoreState) => state.blockchain.wethTokenBalance;
export const getConvertBalanceState = (state: StoreState) => state.blockchain.convertBalanceState;
export const getWethBalance = (state: StoreState) =>
    state.blockchain.wethTokenBalance ? state.blockchain.wethTokenBalance.balance : new BigNumber(0);
export const getOrders = (state: StoreState) => state.relayer.orders;
export const getUserOrders = (state: StoreState) => state.relayer.userOrders;
export const getOrderPriceSelected = (state: StoreState) => state.ui.orderPriceSelected;
export const getNotifications = (state: StoreState) => state.ui.notifications;
export const getFills = (state: StoreState) => state.ui.fills;
export const getUserFills = (state: StoreState) => state.ui.userFills;
export const getMarketFills = (state: StoreState) => state.ui.marketFills;
export const getUserMarketFills = (state: StoreState) => state.ui.userMarketFills;
export const getHasUnreadNotifications = (state: StoreState) => state.ui.hasUnreadNotifications;
export const getStepsModalPendingSteps = (state: StoreState) => state.ui.stepsModal.pendingSteps;
export const getStepsModalDoneSteps = (state: StoreState) => state.ui.stepsModal.doneSteps;
export const getStepsModalCurrentStep = (state: StoreState) => state.ui.stepsModal.currentStep;
export const getSideBarOpenState = (state: StoreState) => state.ui.sidebarOpen;
export const getOpenFiatOnRampModalState = (state: StoreState) => state.ui.openFiatOnRampModal;
export const getCurrencyPair = (state: StoreState) => state.market.currencyPair;
export const getBaseToken = (state: StoreState) => state.market.baseToken;
export const getQuoteToken = (state: StoreState) => state.market.quoteToken;
export const getMarkets = (state: StoreState) => state.market.markets;
export const getEthInUsd = (state: StoreState) => state.market.ethInUsd;
export const getTokensPrice = (state: StoreState) => state.market.tokensPrice;
export const getQuoteInUsd = (state: StoreState) => state.market.quoteInUsd;
export const getGasPriceInWei = (state: StoreState) => state.blockchain.gasInfo.gasPriceInWei;
export const getEstimatedTxTimeMs = (state: StoreState) => state.blockchain.gasInfo.estimatedTimeMs;
export const getAllCollectibles = (state: StoreState) => state.collectibles.allCollectibles;
export const getAllCollectiblesFetchStatus = (state: StoreState) => state.collectibles.allCollectiblesFetchStatus;
export const getCollectibleById = (state: StoreState, props: { collectibleId: string }): Collectible | undefined =>
    state.collectibles.allCollectibles[props.collectibleId];
export const getSelectedCollectible = (state: StoreState) => state.collectibles.collectibleSelected;
export const getCurrentRoutePath = (state: StoreState) => state.router.location.pathname;
export const getRouterLocationSearch = (state: StoreState) => state.router.location.search;
export const getAccountMarketStats = (state: StoreState) => state.relayer.accountMarketStats;
export const getITokensData = (state: StoreState) => state.bzx.iTokensData;
export const getBZXiTokensList = (state: StoreState) => state.bzx.TokensList;
export const getBZXLoadingState = (state: StoreState) => state.bzx.bzxLoadingState;
export const getIEOOrders = (state: StoreState) => state.relayer.ieoOrders;
export const getUserIEOUIOrders = (state: StoreState) => state.relayer.userIEOOrders;
export const getERC20Theme = (state: StoreState) => state.ui.erc20Theme;
export const getThemeName = (state: StoreState) => state.ui.themeName;
export const getGeneralConfig = (state: StoreState) => state.ui.generalConfig;
export const getConfigData = (state: StoreState) => state.ui.configData;
export const getMarketStats = (state: StoreState) => state.market.marketStats;

export const getCurrentMarketPlace = createSelector(
    getCurrentRoutePath,
    (currentRoute: string) => {
        if (currentRoute.includes(ERC20_APP_BASE_PATH)) {
            return MARKETPLACES.ERC20;
        } else if (currentRoute.includes(ERC721_APP_BASE_PATH)) {
            return MARKETPLACES.ERC721;
        } else if (currentRoute.includes(LAUNCHPAD_APP_BASE_PATH)) {
            return MARKETPLACES.LaunchPad;
        } else if (currentRoute.includes(MARGIN_APP_BASE_PATH)) {
            return MARKETPLACES.Margin;
        } else if (currentRoute.includes(INSTANT_APP_BASE_PATH)) {
            return MARKETPLACES.Instant;
        } else {
            return MARKETPLACES.ERC20;
        }
    },
);

export const getCurrentMarketFills = createSelector(
    getMarketFills,
    getCurrencyPair,
    (marketFills: MarketFill, currencyPair: CurrencyPair) => {
        const pair = marketToString(currencyPair);
        return marketFills[pair] ? marketFills[pair] : [];
    },
);

export const getCurrentMarketLastPrice = createSelector(
    getCurrentMarketFills,
    (marketFills: Fill[]) => {
        return getLastPrice(marketFills);
    },
);

export const getCurrentMarketTodayVolume = USE_RELAYER_MARKET_UPDATES
    ? createSelector(
          getMarketStats,
          (stats: RelayerMarketStats | null) => {
              if (stats) {
                  return new BigNumber(stats.volume_24);
              } else {
                  return new BigNumber(0);
              }
          },
      )
    : createSelector(
          getCurrentMarketFills,
          (marketFills: Fill[]) => {
              return getTodayVolumeFromFills(marketFills);
          },
      );

export const getCurrentMarketTodayHighPrice = USE_RELAYER_MARKET_UPDATES
    ? createSelector(
          getMarketStats,
          (stats: RelayerMarketStats | null) => {
              if (stats) {
                  return new BigNumber(stats.price_max_24);
              } else {
                  return new BigNumber(0);
              }
          },
      )
    : createSelector(
          getCurrentMarketFills,
          (marketFills: Fill[]) => {
              return getTodayHighPriceFromFills(marketFills);
          },
      );

export const getCurrentMarketTodayLowerPrice = USE_RELAYER_MARKET_UPDATES
    ? createSelector(
          getMarketStats,
          (stats: RelayerMarketStats | null) => {
              if (stats) {
                  return new BigNumber(stats.price_min_24);
              } else {
                  return null;
              }
          },
      )
    : createSelector(
          getCurrentMarketFills,
          (marketFills: Fill[]) => {
              return getTodayLowerPriceFromFills(marketFills);
          },
      );

export const getCurrentMarketTodayClosedOrders = USE_RELAYER_MARKET_UPDATES
    ? createSelector(
          getMarketStats,
          (stats: RelayerMarketStats | null) => {
              if (stats) {
                  return stats.total_orders;
              } else {
                  return 0;
              }
          },
      )
    : createSelector(
          getCurrentMarketFills,
          (marketFills: Fill[]) => {
              return getTodayClosedOrdersFromFills(marketFills);
          },
      );

const searchToken = ({ tokenBalances, tokenToFind, wethTokenBalance }: SearchTokenBalanceObject) => {
    if (tokenToFind && isWeth(tokenToFind.symbol)) {
        return wethTokenBalance;
    }
    return (
        tokenBalances.find(
            (tokenBalance: TokenBalance) => tokenBalance.token.symbol === (tokenToFind && tokenToFind.symbol),
        ) || null
    );
};

export const getTotalEthBalance = createSelector(
    getEthBalance,
    getWethBalance,
    (ethBalance: BigNumber, wethTokenBalance: BigNumber) => ethBalance.plus(wethTokenBalance),
);

export const getBaseTokenBalance = createSelector(
    getTokenBalances,
    getWethTokenBalance,
    getBaseToken,
    (tokenBalances: TokenBalance[], wethTokenBalance: TokenBalance | null, baseToken: Token | null) =>
        searchToken({ tokenBalances, wethTokenBalance, tokenToFind: baseToken }),
);

export const getQuoteTokenBalance = createSelector(
    getTokenBalances,
    getWethTokenBalance,
    getQuoteToken,
    (tokenBalances: TokenBalance[], wethTokenBalance: TokenBalance | null, quoteToken: Token | null) =>
        searchToken({ tokenBalances, wethTokenBalance, tokenToFind: quoteToken }),
);

export const getOpenOrders = createSelector(
    getOrders,
    getWeb3State,
    (orders, web3State) => {
        switch (web3State) {
            case Web3State.NotInstalled:
            case Web3State.Error:
            case Web3State.Connect:
            case Web3State.Connecting:
            case Web3State.Locked: {
                return orders;
            }
            default: {
                return orders.filter(order => order.status === OrderStatus.Fillable);
            }
        }
    },
);

export const getOpenSellOrders = createSelector(
    getOpenOrders,
    orders => {
        return orders.filter(order => order.side === OrderSide.Sell).sort((o1, o2) => o2.price.comparedTo(o1.price));
    },
);

export const getOpenBuyOrders = createSelector(
    getOpenOrders,
    orders => {
        return orders.filter(order => order.side === OrderSide.Buy).sort((o1, o2) => o2.price.comparedTo(o1.price));
    },
);

export const getMySizeOrders = createSelector(
    getUserOrders,
    userOrders => {
        return userOrders
            .filter(userOrder => userOrder.status === OrderStatus.Fillable)
            .map(order => {
                let newSize = order.size;
                if (order.filled) {
                    newSize = order.size.minus(order.filled);
                }
                return {
                    size: newSize,
                    side: order.side,
                    price: order.price,
                };
            });
    },
);

export const getSpread = createSelector(
    getOpenBuyOrders,
    getOpenSellOrders,
    (buyOrders, sellOrders) => {
        if (!buyOrders.length || !sellOrders.length) {
            return new BigNumber(0);
        }

        const lowestPriceSell = sellOrders[sellOrders.length - 1].price;
        const highestPriceBuy = buyOrders[0].price;

        return lowestPriceSell.minus(highestPriceBuy);
    },
);

export const getSpreadInPercentage = createSelector(
    getSpread,
    getOpenSellOrders,
    (absSpread, sellOrders) => {
        if (!sellOrders.length) {
            return new BigNumber(0);
        }

        const lowestPriceSell = sellOrders[sellOrders.length - 1].price;
        return absSpread.dividedBy(lowestPriceSell).multipliedBy(100);
    },
);

export const getOrderBook = createSelector(
    getOpenSellOrders,
    getOpenBuyOrders,
    getMySizeOrders,
    getCurrencyPair,
    (sellOrders, buyOrders, mySizeOrders, currencyPair): OrderBook => {
        const orderBook = {
            sellOrders: mergeByPrice(sellOrders, currencyPair.config.pricePrecision),
            buyOrders: mergeByPrice(buyOrders, currencyPair.config.pricePrecision),
            mySizeOrders,
        };
        return orderBook;
    },
);

export const getTokens = createSelector(
    getTokenBalances,
    (tokenBalances): Token[] => {
        return tokenBalances.map((tokenBalance, index) => {
            const { token } = tokenBalance;
            return token;
        });
    },
);

export const getUserCollectibles = createSelector(
    getEthAccount,
    getAllCollectibles,
    (ethAccount, allCollectibles): { [key: string]: Collectible } => {
        const userCollectibles: { [key: string]: Collectible } = {};
        Object.keys(allCollectibles).forEach(tokenId => {
            if (allCollectibles[tokenId].currentOwner.toLowerCase() === ethAccount.toLowerCase()) {
                userCollectibles[tokenId] = allCollectibles[tokenId];
            }
        });
        return userCollectibles;
    },
);

export const getUserCollectiblesAvailableToSell = createSelector(
    getUserCollectibles,
    (userCollectibles): { [key: string]: Collectible } => {
        const userCollectiblesAvailableToSell: { [key: string]: Collectible } = {};
        Object.keys(userCollectibles).forEach(tokenId => {
            const collectibleIterator = userCollectibles[tokenId];
            if (collectibleIterator.order === null) {
                userCollectiblesAvailableToSell[tokenId] = collectibleIterator;
            }
        });
        return userCollectiblesAvailableToSell;
    },
);

export const getUserCollectiblesOnSell = createSelector(
    getUserCollectibles,
    (userCollectibles): { [key: string]: Collectible } => {
        const userCollectiblesOnSell: { [key: string]: Collectible } = {};
        Object.keys(userCollectibles).forEach(tokenId => {
            const collectibleIterator = userCollectibles[tokenId];
            if (collectibleIterator.order) {
                userCollectiblesOnSell[tokenId] = collectibleIterator;
            }
        });
        return userCollectiblesOnSell;
    },
);

export const getOtherUsersCollectibles = createSelector(
    getEthAccount,
    getAllCollectibles,
    (ethAccount, allCollectibles): { [key: string]: Collectible } => {
        const userCollectibles: { [key: string]: Collectible } = {};
        Object.keys(allCollectibles).forEach(tokenId => {
            if (allCollectibles[tokenId].currentOwner.toLowerCase() !== ethAccount.toLowerCase()) {
                userCollectibles[tokenId] = allCollectibles[tokenId];
            }
        });
        return userCollectibles;
    },
);

export const getUsersCollectiblesAvailableToList = createSelector(
    getOtherUsersCollectibles,
    getUserCollectiblesOnSell,
    (otherUsersCollectibles, userCollectiblesOnSell): { [key: string]: Collectible } => {
        return { ...otherUsersCollectibles, ...userCollectiblesOnSell };
    },
);
