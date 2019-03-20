import { BigNumber } from '0x.js';
import queryString from 'query-string';
import { getType } from 'typesafe-actions';

import { MarketPrice, MarketPriceState, MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialMarketPriceEtherState: MarketPrice = {
    symbol: '',
    priceUSD: new BigNumber(0),
    priceDAI: new BigNumber(0),
    priceETHER: new BigNumber(0),
    volumeUSD: new BigNumber(0),
    percentChange: new BigNumber(0),
};

const initialMarketPricesState: MarketPriceState = {
    eth: initialMarketPriceEtherState,
};

const initialMarketState: MarketState = {
    currencyPair: {
        base: (queryString.parse(location.search).base as string) || 'ZRX',
        quote: (queryString.parse(location.search).quote as string) || 'WETH',
    },
    baseToken: null,
    quoteToken: null,
    prices: initialMarketPricesState,
};

export function market(state: MarketState = initialMarketState, action: RootAction): MarketState {
    switch (action.type) {
        case getType(actions.setMarketTokens):
            return { ...state, baseToken: action.payload.baseToken, quoteToken: action.payload.quoteToken };
        case getType(actions.setCurrencyPair):
            return { ...state, currencyPair: action.payload };
        case getType(actions.fetchMarketPriceEtherUpdate):
            return { ...state, prices: action.payload };
        case getType(actions.fetchMarketPriceEtherStart):
            return state;
        case getType(actions.fetchMarketPriceEtherError):
            return state;
    }
    return state;
}
