import { createAction } from 'typesafe-actions';

import { Token } from '../../util/types';

export const setMarketTokens = createAction('SET_MARKET_TOKENS', resolve => {
    return ({ baseToken, quoteToken }: { baseToken: Token; quoteToken: Token }) => resolve({ baseToken, quoteToken });
});
