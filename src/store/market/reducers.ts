import queryString from 'query-string';
import { getType } from 'typesafe-actions';

import { getAvailableMarkets } from '../../common/markets';
import { getCurrencyPairByTokensSymbol } from '../../util/known_currency_pairs';
import { MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const parsedUrl = new URL(window.location.href.replace('#/', ''));
const base = parsedUrl.searchParams.get('base') || getAvailableMarkets()[0].base;
const quote = parsedUrl.searchParams.get('quote') || getAvailableMarkets()[0].quote;
let currencyPair;
try {
    currencyPair = getCurrencyPairByTokensSymbol(base, quote);
} catch (e) {
    currencyPair = getCurrencyPairByTokensSymbol(getAvailableMarkets()[0].base, getAvailableMarkets()[0].quote);
}
const getMakerAddresses = () => {
    const makerAddressesString = queryString.parse(queryString.extract(window.location.hash)).makerAddresses as string;
    if (!makerAddressesString) {
        return null;
    }
    const makerAddresses = makerAddressesString.split(',');
    return makerAddresses.map(a => a.toLowerCase());
};

const initialMarketState: MarketState = {
    currencyPair,
    baseToken: null,
    quoteToken: null,
    markets: null,
    ethInUsd: null,
    tokensPrice: null,
    marketStats: null,
    makerAddresses: getMakerAddresses(),
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
        case getType(actions.setMarketStats):
            return { ...state, marketStats: action.payload };
        default:
            return state;
    }
}
