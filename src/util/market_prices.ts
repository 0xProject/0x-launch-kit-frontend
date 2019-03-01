import { BigNumber } from '0x.js';

import {
    CACHE_CHECK_INTERVAL,
    ETH_MARKET_PRICE_API_ENDPOINT,
    ZEROX_MARKET_PRICE_API_ENDPOINT,
} from '../common/constants';

let ethPriceInUSD: BigNumber | null;
let zeroXPriceInUSD: BigNumber | null;
let isActiveCache: boolean = false;

export const getEthereumPriceInUSD = async (): Promise<BigNumber> => {
    if (!ethPriceInUSD) {
        const response = await fetch(ETH_MARKET_PRICE_API_ENDPOINT);
        const ethereumPriceInUSD = await response.json();
        const priceUsd: string = (ethereumPriceInUSD as any)[0].price_usd;
        ethPriceInUSD = new BigNumber(priceUsd);
        cachePrices();
    }
    return ethPriceInUSD;
};

export const getZeroXPriceInUSD = async (): Promise<BigNumber> => {
    if (!zeroXPriceInUSD) {
        const response = await fetch(ZEROX_MARKET_PRICE_API_ENDPOINT);
        const zeroXPrice = await response.json();
        const priceUsd: string = (zeroXPrice as any)[0].price_usd;
        zeroXPriceInUSD = new BigNumber(priceUsd);
        cachePrices();
    }
    return zeroXPriceInUSD;
};

const cachePrices = () => {
    if (!isActiveCache) {
        setInterval(async () => {
            ethPriceInUSD = null;
            await getEthereumPriceInUSD();
            await getZeroXPriceInUSD();
            isActiveCache = true;
        }, CACHE_CHECK_INTERVAL);
    }
};
