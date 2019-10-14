import { getType } from 'typesafe-actions';

import { availableMarkets } from '../../common/markets';
import { getCurrencyPairByTokensSymbol } from '../../util/known_currency_pairs';
import { MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const parsedUrl = new URL(window.location.href.replace('#/', ''));
const base = parsedUrl.searchParams.get('base') || availableMarkets[0].base;
const quote = parsedUrl.searchParams.get('quote') || availableMarkets[0].quote;
const currencyPair = getCurrencyPairByTokensSymbol(base, quote);

const initialMarketState: MarketState = {
    currencyPair,
    baseToken: null,
    quoteToken: null,
    markets: null,
    ethInUsd: null,
    tokensPrice: null,
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
        case getType(actions.fetchMarketPriceTokensStart):
            return state;
        case getType(actions.fetchMarketPriceTokensUpdate):
            return { ...state, tokensPrice: action.payload };
        case getType(actions.fetchMarketPriceTokensError):
            return state;
        case getType(actions.fetchERC20MarketsError):
            return state;
        default:
            return state;
    }
}
