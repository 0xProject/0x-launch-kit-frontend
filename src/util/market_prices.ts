import { BigNumber } from '0x.js';

import {
    CACHE_CHECK_INTERVAL,
    ETH_MARKET_PRICE_API_ENDPOINT,
    MAKER_FEE,
    ZEROX_MARKET_PRICE_API_ENDPOINT,
} from '../common/constants';
import { getAllOrdersAsUIOrders } from '../services/orders';
import { getWeb3Wrapper } from '../services/web3_wrapper';

import { getKnownTokens } from './known_tokens';
import { OrderSide } from './types';

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

export const getZeroXPriceInWeth = async (): Promise<BigNumber> => {
    /* Gets all the available sell orders of 0x and takes the lowest price, is there are no 0x sells orders available, the price is calculated using coin market */
    const web3Wrapper = await getWeb3Wrapper();
    let zeroXPrice = new BigNumber('0');
    if (web3Wrapper) {
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const knownTokens = getKnownTokens(networkId);
        const zeroXToken = knownTokens.getTokenBySymbol('ZRX');
        let sellOrders = await getAllOrdersAsUIOrders(zeroXToken);
        if (sellOrders && sellOrders.length > 0) {
            sellOrders = sellOrders
                .filter(order => order.side === OrderSide.Sell)
                .sort((o1, o2) => o1.price.comparedTo(o2.price));
            /* Check if there is any order that could fill the needs of 0x */
            const orderWithEnoughZeroX = sellOrders.find(sellOrder => {
                return sellOrder.size.cmp(MAKER_FEE) === 1;
            });
            zeroXPrice = orderWithEnoughZeroX ? orderWithEnoughZeroX.price : zeroXPrice;
        }
        if (!zeroXPrice) {
            const zeroXInUSD = await getZeroXPriceInUSD();
            const ethInUSD = await getEthereumPriceInUSD();
            zeroXPrice = zeroXInUSD.mul(ethInUSD);
        }
    }

    return zeroXPrice;
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
