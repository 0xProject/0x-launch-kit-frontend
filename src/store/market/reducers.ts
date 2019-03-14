import { getType } from 'typesafe-actions';

import { MarketState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialMarketState: MarketState = {
    currencyPair: {
        base: 'ZRX',
        quote: 'WETH',
    },
    baseToken: null,
    quoteToken: null,
};

export function market(state: MarketState = initialMarketState, action: RootAction): MarketState {
    switch (action.type) {
        case getType(actions.setMarketTokens):
            return { ...state, baseToken: action.payload.baseToken, quoteToken: action.payload.quoteToken };
    }
    return state;
}
