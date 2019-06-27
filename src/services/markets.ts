import { BigNumber } from '0x.js';

const ETH_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

const MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/';

export const getMarketPriceEther = async (): Promise<BigNumber> => {
    const promisePriceEtherResolved = await fetch(ETH_MARKET_PRICE_API_ENDPOINT);
    if (promisePriceEtherResolved.status === 200) {
        const data = await promisePriceEtherResolved.json();
        if (data && data.length) {
            const item = data[0];
            const priceTokenUSD = new BigNumber(item.price_usd);
            return priceTokenUSD;
        }
    }

    return Promise.reject('Could not get ETH price');
};

export const getMarketPriceQuote = async (quoteId: string): Promise<BigNumber> => {
    const promisePriceQuoteResolved = await fetch(`${MARKET_PRICE_API_ENDPOINT}${quoteId}/`);
    if (promisePriceQuoteResolved.status === 200) {
        const data = await promisePriceQuoteResolved.json();
        if (data && data.length) {
            const item = data[0];
            const priceTokenUSD = new BigNumber(item.price_usd);
            return priceTokenUSD;
        }
    }

    return Promise.reject('Could not get Quote price');
};
