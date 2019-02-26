import { BigNumber } from '0x.js';

import { MARKET_PRICE_API_ENDPOINT } from '../common/constants';

export const GetEthereumPriceInUSD = async (): Promise<any> => {
    const response = await fetch(MARKET_PRICE_API_ENDPOINT);
    const ethereumPriceInUSD = await response.json();
    const priceUsd: string = (ethereumPriceInUSD as any)[0].price_usd;
    return new BigNumber(priceUsd);
};
