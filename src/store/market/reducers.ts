import queryString from 'query-string';
import { getType } from 'typesafe-actions';

import { availableMarkets } from '../../common/markets';
import { MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const getMakerAddresses = () => {
    const makerAddressesString = queryString.parse(queryString.extract(window.location.hash)).makerAddresses as string;
    if (!makerAddressesString) {
        return null;
    }
    const makerAddresses = makerAddressesString.split(',');
    return makerAddresses.map(a => a.toLowerCase());
};

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
        default:
            return state;
    }
}
