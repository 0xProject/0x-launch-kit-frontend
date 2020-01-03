import { BigNumber } from '@0x/utils';

import { TokenBalance, TokenPrice } from '../util/types';

const ETH_MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

const MARKET_PRICE_API_ENDPOINT = 'https://api.coinmarketcap.com/v1/ticker/';

const TOKENS_MARKET_PRICE_API_ENDPOINT = 'https://api.coingecko.com/api/v3/';

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

export const getMarketPriceTokens = async (tokensBalance: TokenBalance[]): Promise<TokenPrice[]> => {
    // Reduce this to only a 1 string, if we have more than 50 tokens this will not work

    const accToken = tokensBalance
        .map(tb => tb.token)
        .filter(t => t.c_id !== null)
        .map(t => t.c_id)
        .reduce((p, c, i) => {
            if (i === 0) {
                return `${c}`;
            } else {
                return `${p},${c}`;
            }
        });
    const promisePriceTokensResolved = await fetch(
        `${TOKENS_MARKET_PRICE_API_ENDPOINT}simple/price?ids=${accToken}&vs_currencies=usd&include_24hr_change=true`,
    );

    if (promisePriceTokensResolved.status === 200) {
        const data = await promisePriceTokensResolved.json();

        if (data) {
            const tokensPrices: TokenPrice[] = [];
            // iterate over keys eg:
            /*  {
                  "ethereum": {
                    "usd": 222.54,
                    "usd_24h_change": 8.708196777899076
                  },
                  "verisafe": {
                    "usd": 0.00010086,
                    "usd_24h_change": 4.050324813355142
                  }
                }*/
            Object.keys(data).forEach((id: string) => {
                const priceStats: { usd: number; usd_24h_change: number } = data[id];
                const ind = tokensBalance.findIndex(tb => tb.token.c_id === id) as number;
                if (ind !== -1) {
                    tokensPrices.push({
                        c_id: tokensBalance[ind].token.c_id as string,
                        price_usd: new BigNumber(priceStats.usd),
                        price_usd_24h_change: new BigNumber(priceStats.usd_24h_change),
                    });
                }
            });
            return tokensPrices;
        }
    }
    return Promise.reject('Could not get Tokens price');
};
