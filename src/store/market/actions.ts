import { BigNumber } from '0x.js';
import { push } from 'connected-react-router';
import queryString from 'query-string';
import { createAction } from 'typesafe-actions';

import { ERC20_APP_BASE_PATH, USE_RELAYER_MARKET_UPDATES } from '../../common/constants';
import { getAvailableMarkets } from '../../common/markets';
import { getMarketPriceEther, getMarketPriceQuote, getMarketPriceTokens } from '../../services/markets';
import { getMarketStatsFromRelayer, getRelayer } from '../../services/relayer';
import { getKnownTokens } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { marketToString } from '../../util/markets';
import {
    CurrencyPair,
    Market,
    RelayerMarketStats,
    StoreState,
    ThunkCreator,
    Token,
    TokenBalance,
    TokenPrice,
} from '../../util/types';
import { fetchPastMarketFills, getOrderbookAndUserOrders } from '../actions';
import { getCurrencyPair, getWethTokenBalance } from '../selectors';

const logger = getLogger('Market::Actions');

export const setMarketTokens = createAction('market/MARKET_TOKENS_set', resolve => {
    return ({ baseToken, quoteToken }: { baseToken: Token; quoteToken: Token }) => resolve({ baseToken, quoteToken });
});

export const setCurrencyPair = createAction('market/CURRENCY_PAIR_set', resolve => {
    return (currencyPair: CurrencyPair) => resolve(currencyPair);
});

export const setMarkets = createAction('market/MARKETS_set', resolve => {
    return (markets: Market[]) => resolve(markets);
});

export const setMarketStats = createAction('market/MARKETS_STATS_set', resolve => {
    return (marketStats: RelayerMarketStats) => resolve(marketStats);
});

// Market Price Ether Actions
export const fetchMarketPriceEtherError = createAction('market/PRICE_ETHER_fetch_failure', resolve => {
    return (payload: any) => resolve(payload);
});

export const fetchMarketPriceEtherStart = createAction('market/PRICE_ETHER_fetch_request', resolve => {
    return () => resolve();
});

export const fetchMarketPriceEtherUpdate = createAction('market/PRICE_ETHER_fetch_success', resolve => {
    return (ethInUsd: BigNumber) => resolve(ethInUsd);
});
// Market Price Quote Actions
export const fetchMarketPriceQuoteError = createAction('market/PRICE_QUOTE_fetch_failure', resolve => {
    return (payload: any) => resolve(payload);
});

export const fetchMarketPriceQuoteStart = createAction('market/PRICE_QUOTE_fetch_request', resolve => {
    return () => resolve();
});

export const fetchMarketPriceQuoteUpdate = createAction('market/PRICE_QUOTE_fetch_success', resolve => {
    return (quoteInUsd: BigNumber) => resolve(quoteInUsd);
});

export const fetchMarketPriceTokensStart = createAction('market/PRICE_TOKENS_fetch_request', resolve => {
    return () => resolve();
});

export const fetchMarketPriceTokensUpdate = createAction('market/PRICE_TOKENS_fetch_success', resolve => {
    return (tokensPrices: TokenPrice[]) => resolve(tokensPrices);
});

export const fetchMarketPriceTokensError = createAction('market/PRICE_TOKENS_fetch_failure', resolve => {
    return (payload: any) => resolve(payload);
});

export const fetchERC20MarketsError = createAction('market/ERC20_MARKETS_TOKENS_fetch_failure', resolve => {
    return (payload: any) => resolve(payload);
});

export const changeMarket: ThunkCreator = (currencyPair: CurrencyPair) => {
    return async (dispatch, getState) => {
        const state = getState() as StoreState;
        const oldQuoteToken = state.market.quoteToken;
        const knownTokens = getKnownTokens();
        try {
            const newQuoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);
            dispatch(
                setMarketTokens({
                    baseToken: knownTokens.getTokenBySymbol(currencyPair.base),
                    quoteToken: newQuoteToken,
                }),
            );
            dispatch(setCurrencyPair(currencyPair));

            // if quote token changed, update quote price
            if (oldQuoteToken !== newQuoteToken) {
                try {
                    await dispatch(updateMarketPriceQuote());
                } catch (e) {
                    logger.error(`Failed to get Quote price`);
                }
            }
        } catch (e) {
            logger.error(`Failed to set token market ${e}`);
        }
        if (USE_RELAYER_MARKET_UPDATES) {
            // tslint:disable-next-line:no-floating-promises
            dispatch(fetchPastMarketFills());
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateMarketStats());
        }

        // tslint:disable-next-line:no-floating-promises
        dispatch(getOrderbookAndUserOrders());

        const newSearch = queryString.stringify({
            ...queryString.parse(state.router.location.search),
            base: currencyPair.base,
            quote: currencyPair.quote,
        });

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/`,
                search: newSearch,
            }),
        );
    };
};

export const fetchMarkets: ThunkCreator = () => {
    return async dispatch => {
        const knownTokens = getKnownTokens();
        const relayer = getRelayer();
        let markets: any[] = await Promise.all(
            getAvailableMarkets().map(async availableMarket => {
                try {
                    const baseToken = knownTokens.getTokenBySymbol(availableMarket.base);
                    const quoteToken = knownTokens.getTokenBySymbol(availableMarket.quote);

                    const marketData = await relayer.getCurrencyPairMarketDataAsync(baseToken, quoteToken);
                    return {
                        currencyPair: availableMarket,
                        ...marketData,
                    };
                } catch (err) {
                    logger.error(
                        `Failed to get price of currency pair ${availableMarket.base}/${availableMarket.quote}`,
                    );
                    return {
                        currencyPair: availableMarket,
                        bestAsk: null,
                        bestBid: null,
                        spreadInPercentage: null,
                    };
                }
            }),
        );

        markets = markets.filter(
            (value: any): Market => {
                return value && value.currencyPair;
            },
        );

        if (markets && markets.length > 0) {
            dispatch(setMarkets(markets));
        }
        return markets;
    };
};

export const updateMarketPriceEther: ThunkCreator = () => {
    return async dispatch => {
        dispatch(fetchMarketPriceEtherStart());

        try {
            const marketPriceEtherData = await getMarketPriceEther();
            dispatch(fetchMarketPriceEtherUpdate(marketPriceEtherData));
        } catch (err) {
            dispatch(fetchMarketPriceEtherError(err));
        }
    };
};

export const updateMarketPriceQuote: ThunkCreator = () => {
    return async (dispatch, getState) => {
        dispatch(fetchMarketPriceQuoteStart());
        const state = getState() as StoreState;
        try {
            const quoteToken = state.market.quoteToken;
            if (quoteToken && quoteToken.id) {
                // if ethereum price is already fetched we use it
                if (quoteToken.id === 'ethereum' && state.market.ethInUsd) {
                    dispatch(fetchMarketPriceQuoteUpdate(state.market.ethInUsd));
                } else {
                    const marketPriceQuoteData = await getMarketPriceQuote(quoteToken.id);
                    dispatch(fetchMarketPriceQuoteUpdate(marketPriceQuoteData));
                }
            } else {
                throw new Error('Quote Token Need ID');
            }
        } catch (err) {
            dispatch(fetchMarketPriceQuoteError(err));
        }
    };
};

export const updateMarketPriceTokens: ThunkCreator = () => {
    return async (dispatch, getState) => {
        dispatch(fetchMarketPriceTokensStart());
        const state = getState() as StoreState;
        try {
            let tBalances: TokenBalance[] = [];
            const tokenBalances = state.blockchain.tokenBalances;
            const wethBalance = getWethTokenBalance(state);
            wethBalance ? (tBalances = [...tokenBalances, wethBalance]) : (tBalances = [...tokenBalances]);
            const tokensPrices = await getMarketPriceTokens(tBalances);
            dispatch(fetchMarketPriceTokensUpdate(tokensPrices));
        } catch (err) {
            dispatch(fetchMarketPriceTokensError(err));
        }
    };
};

export const updateERC20Markets = () => {
    return async (dispatch: any) => {
        try {
            // tslint:disable-next-line:no-floating-promises
            dispatch(fetchMarkets());
            if (USE_RELAYER_MARKET_UPDATES) {
                dispatch(updateMarketStats());
            }
        } catch (error) {
            dispatch(fetchERC20MarketsError(error));
        }
    };
};

export const updateMarketStats: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState() as StoreState;
        const currencyPair = getCurrencyPair(state);
        const market = marketToString(currencyPair);
        try {
            const marketStats = await getMarketStatsFromRelayer(market);
            if (marketStats) {
                dispatch(setMarketStats(marketStats));
            }
        } catch (error) {
            logger.error('Failed to update market stats', error);
        }
    };
};
