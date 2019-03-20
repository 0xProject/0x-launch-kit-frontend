import { BigNumber } from '0x.js';
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
    prices: initialMarketPricesState,
};

export function marketPrices(state: MarketPriceState = initialMarketPricesState, action: RootAction): MarketPriceState {
    switch (action.type) {
        case getType(actions.fetchMarketPriceEtherStart):
            return state;
        case getType(actions.fetchMarketPriceEtherError):
            return state;
        case getType(actions.fetchMarketPriceEtherUpdate):
            return action.payload;
    }
    return state;
}

export function market(state: MarketState = initialMarketState, action: RootAction): MarketState {
    return {
        ...state,
        prices: marketPrices(state.prices, action),
    };
}
