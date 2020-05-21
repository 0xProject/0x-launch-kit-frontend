import { BigNumber } from '@0x/utils';
import { push } from 'connected-react-router';
import queryString from 'query-string';
import { createAction } from 'typesafe-actions';

import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { availableMarkets } from '../../common/markets';
import { getMarketPriceEther } from '../../services/markets';
import { getRelayer } from '../../services/relayer';
import { getKnownTokens } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { CurrencyPair, Market, StoreState, ThunkCreator, Token } from '../../util/types';
import { getOrderbookAndUserOrders } from '../actions';

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

export const changeMarket: ThunkCreator = (currencyPair: CurrencyPair) => {
    return async (dispatch, getState) => {
        const knownTokens = getKnownTokens();

        dispatch(
            setMarketTokens({
                baseToken: knownTokens.getTokenBySymbol(currencyPair.base),
                quoteToken: knownTokens.getTokenBySymbol(currencyPair.quote),
            }),
        );
        dispatch(setCurrencyPair(currencyPair));
        // tslint:disable-next-line:no-floating-promises
        dispatch(getOrderbookAndUserOrders());

        const state = getState() as StoreState;
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
            availableMarkets.map(async availableMarket => {
                try {
                    const baseToken = knownTokens.getTokenBySymbol(availableMarket.base);
                    const quoteToken = knownTokens.getTokenBySymbol(availableMarket.quote);

                    const price = await relayer.getCurrencyPairPriceAsync(baseToken, quoteToken);

                    return {
                        currencyPair: availableMarket,
                        price,
                    };
                } catch (err) {
                    logger.error(
                        `Failed to get price of currency pair ${availableMarket.base}/${availableMarket.quote}`,
                    );
                    return {
                        currencyPair: availableMarket,
                        price: null,
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
