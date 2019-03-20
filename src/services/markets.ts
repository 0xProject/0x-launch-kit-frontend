import { BigNumber } from '0x.js';

import { ETH_MARKET_PRICE_API_ENDPOINT } from '../common/constants';
import { MarketPrice } from '../util/types';

export const getMarketPriceEther = async (): Promise<MarketPrice> => {
    let marketItem: MarketPrice = {
        symbol: '',
        priceUSD: new BigNumber(0),
        priceDAI: new BigNumber(0),
        priceETHER: new BigNumber(0),
        volumeUSD: new BigNumber(0),
        percentChange: new BigNumber(0),
    };

    const promisePriceEtherResolved = await fetch(ETH_MARKET_PRICE_API_ENDPOINT);
    if (promisePriceEtherResolved.status === 200) {
        const data = await promisePriceEtherResolved.json();
        if (data && data.length) {
            const item = data[0];
            const priceTokenUSD = new BigNumber(item.price_usd);

            marketItem = {
                symbol: item.symbol,
                priceUSD: priceTokenUSD,
                priceDAI: priceTokenUSD,
                priceETHER: new BigNumber(1),
                volumeUSD: new BigNumber(item['24h_volume_usd']),
                percentChange: new BigNumber(item.percent_change_24h),
            };
        }
    }
    return marketItem;
};
