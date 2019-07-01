import queryString from 'query-string';
import { getType } from 'typesafe-actions';

import { availableMarkets } from '../../common/markets';
import { MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialMarketState: MarketState = {
    currencyPair: {
        base: (queryString.parse(queryString.extract(window.location.hash)).base as string) || availableMarkets[0].base,
        quote:
            (queryString.parse(queryString.extract(window.location.hash)).quote as string) || availableMarkets[0].quote,
    },
    baseToken: null,
    quoteToken: null,
    markets: null,
    ethInUsd: null,
};

export function market(state: MarketState = initialMarketState, action: RootAction): MarketState {
    switch (action.type) {
        case getType(actions.setMarketTokens):
            return { ...state, baseToken: action.payload.baseToken, quoteToken: action.payload.quoteToken };
        case getType(actions.setCurrencyPair):
            return { ...state, currencyPair: action.payload };
        case getType(actions.setMarkets):
            return { ...state, markets: action.payload };
        case getType(actions.fetchMarketPriceEtherUpdate):
            return { ...state, ethInUsd: action.payload };
        case getType(actions.fetchMarketPriceEtherStart):
            return state;
        case getType(actions.fetchMarketPriceEtherError):
            return state;
        case getType(actions.fetchMarketPriceQuoteUpdate):
            return { ...state, quoteInUsd: action.payload };
        case getType(actions.fetchMarketPriceQuoteStart):
            return { ...state, quoteInUsd: null };
        case getType(actions.fetchMarketPriceQuoteError):
            return { ...state, quoteInUsd: null };
        default:
            return state;
    }
}
