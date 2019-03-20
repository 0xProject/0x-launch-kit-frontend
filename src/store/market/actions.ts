import { BigNumber } from '0x.js';
import { push } from 'connected-react-router';
import queryString from 'query-string';
import { createAction } from 'typesafe-actions';

import { getMarketPriceEther } from '../../services/markets';
import { CurrencyPair, MarketPrice, MarketPriceState, StoreState, Token } from '../../util/types';

export const setMarketTokens = createAction('SET_MARKET_TOKENS', resolve => {
    return ({ baseToken, quoteToken }: { baseToken: Token; quoteToken: Token }) => resolve({ baseToken, quoteToken });
});

export const setCurrencyPair = createAction('SET_CURRENCY_PAIR', resolve => {
    return (currencyPair: CurrencyPair) => resolve(currencyPair);
});

// Market Price Ether Actions
export const fetchMarketPriceEtherError = createAction('FETCH_MARKET_PRICE_ETHER_ERROR', resolve => {
    return (payload: any) => resolve(payload);
});

export const fetchMarketPriceEtherStart = createAction('FETCH_MARKET_PRICE_ETHER_START', resolve => {
    return (payload: MarketPrice) => resolve(payload);
});

export const fetchMarketPriceEtherUpdate = createAction('FETCH_MARKET_PRICE_ETHER_UPDATE', resolve => {
    return (payload: MarketPriceState) => resolve(payload);
});

export const changeMarket = (currencyPair: CurrencyPair) => {
    return async (dispatch: any, getState: any) => {
        const state = getState() as StoreState;
        const newSearch = queryString.stringify({
            ...queryString.parse(state.router.location.search),
            base: currencyPair.base,
            quote: currencyPair.quote,
        });

        dispatch(
            push({
                ...state.router.location,
                pathname: '/',
                search: newSearch,
            }),
        );

        location.reload();
    };
};

export const updateMarketPriceEther = () => {
    return async (dispatch: any, getState: any) => {
        dispatch(
            fetchMarketPriceEtherStart({
                symbol: '',
                priceUSD: new BigNumber(0),
                priceDAI: new BigNumber(0),
                priceETHER: new BigNumber(0),
                volumeUSD: new BigNumber(0),
                percentChange: new BigNumber(0),
            }),
        );

        try {
            const marketPriceEtherData = await getMarketPriceEther();
            dispatch(fetchMarketPriceEtherUpdate({ eth: marketPriceEtherData }));
        } catch (err) {
            dispatch(fetchMarketPriceEtherError(err));
        }
    };
};
