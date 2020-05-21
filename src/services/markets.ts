import { BigNumber } from '@0x/utils';

const ETH_MARKET_PRICE_API_ENDPOINT = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1027';

export const getMarketPriceEther = async (): Promise<BigNumber> => {
    const promisePriceEtherResolved = await fetch(ETH_MARKET_PRICE_API_ENDPOINT, {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': '079caa44-3ab2-41ad-86c1-2d7ac2f30325',
        },
    });
    if (promisePriceEtherResolved.status === 200) {
        const data = await promisePriceEtherResolved.json();
        if (data && data[1027]) {
            const item = data[1027];
            const priceTokenUSD = new BigNumber(item.quote.USD.price);
            return priceTokenUSD;
        }
    }

    return Promise.reject('Could not get ETH price');
};
