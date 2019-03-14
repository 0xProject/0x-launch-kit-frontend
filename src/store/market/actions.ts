import { push } from 'connected-react-router';
import queryString from 'query-string';
import { createAction } from 'typesafe-actions';

import { CurrencyPair, StoreState, Token } from '../../util/types';

export const setMarketTokens = createAction('SET_MARKET_TOKENS', resolve => {
    return ({ baseToken, quoteToken }: { baseToken: Token; quoteToken: Token }) => resolve({ baseToken, quoteToken });
});

export const setCurrencyPair = createAction('SET_CURRENCY_PAIR', resolve => {
    return (currencyPair: CurrencyPair) => resolve(currencyPair);
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
                search: newSearch,
            }),
        );

        location.reload();
    };
};
