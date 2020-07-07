import { BigNumber } from '@0x/utils';

const ETH_MARKET_PRICE_API_ENDPOINT = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY={your_key}&symbol=ETH';

export const getMarketPriceEther = async (): Promise<BigNumber> => {

    const promisePriceEtherResolved = await fetch(ETH_MARKET_PRICE_API_ENDPOINT,{ mode: 'no-cors'});
    if (promisePriceEtherResolved.status === 200) {
        const data = await promisePriceEtherResolved.json();
        console.log (data);
        if (data) {
           const priceTokenUSD  = new BigNumber(data.data.ETH.quote.USD.price);
            return priceTokenUSD ;
            
        }
    }

    return Promise.reject('Could not get ETH price');
};
