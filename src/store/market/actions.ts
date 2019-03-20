import { BigNumber } from '0x.js';
import { createAction } from 'typesafe-actions';

import { getMarketPriceEther } from '../../services/markets';
import { MarketPrice, MarketPriceState } from '../../util/types';

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
