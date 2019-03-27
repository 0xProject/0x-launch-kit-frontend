import { filterMarketsByString, filterMarketsByTokenSymbol } from './markets';
import { TokenSymbol } from './types';

const marketExamples = {
    zrxWeth: {
        currencyPair: {
            base: TokenSymbol.Zrx,
            quote: TokenSymbol.Weth,
        },
        price: null,
    },
    wethZrx: {
        currencyPair: {
            base: TokenSymbol.Weth,
            quote: TokenSymbol.Zrx,
        },
        price: null,
    },
    daiMkr: {
        currencyPair: {
            base: TokenSymbol.Dai,
            quote: TokenSymbol.Mkr,
        },
        price: null,
    },
    daiWeth: {
        currencyPair: {
            base: TokenSymbol.Dai,
            quote: TokenSymbol.Weth,
        },
        price: null,
    },
};
const { zrxWeth, wethZrx, daiMkr, daiWeth } = marketExamples;

describe('filterMarketsByTokenSymbol', () => {
    it('should return [] when the are no CurrencyPair with the given TokenSymbol', async () => {
        const markets = [zrxWeth, wethZrx, daiWeth];
        expect(filterMarketsByTokenSymbol(markets, TokenSymbol.Mkr)).toMatchObject([]);
        expect(filterMarketsByTokenSymbol([], TokenSymbol.Mkr)).toMatchObject([]);
    });
    it('should return an array with results that have the given TokenSymbol as base or quote in their market.currencyPair', async () => {
        let markets = [zrxWeth, wethZrx, daiMkr];
        let expectedResult = [zrxWeth, wethZrx];
        expect(filterMarketsByTokenSymbol(markets, TokenSymbol.Zrx)).toMatchObject(expectedResult);
        expect(filterMarketsByTokenSymbol(markets, TokenSymbol.Weth)).toMatchObject(expectedResult);

        markets = [zrxWeth, wethZrx, daiMkr, daiWeth];
        expectedResult = [zrxWeth, wethZrx, daiWeth];
        expect(filterMarketsByTokenSymbol(markets, TokenSymbol.Weth)).toMatchObject(expectedResult);
    });
});

describe('filterMarketsByString', () => {
    it('should return the given markets[] when the given string is empty ("")', async () => {
        const markets = [zrxWeth, wethZrx, daiMkr, daiWeth];
        expect(filterMarketsByString(markets, '')).toMatchObject(markets);
    });
    it('should return [] when the are no CurrencyPair with the given string', async () => {
        const markets = [zrxWeth, wethZrx, daiMkr, daiWeth];
        expect(filterMarketsByString(markets, 's')).toMatchObject([]);
        expect(filterMarketsByString(markets, '1')).toMatchObject([]);
        expect(filterMarketsByString([], 's')).toMatchObject([]);
    });
    it('should return market[] whose "base/quote" (underscore) representation contains the given string (underscore)', async () => {
        const markets = [zrxWeth, wethZrx, daiMkr, daiWeth];
        let expectedResult = [zrxWeth, wethZrx];
        expect(filterMarketsByString(markets, 'z')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'Z')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'zR')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'Zr')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'zr')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'ZR')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'zRx')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'ZRX')).toMatchObject(expectedResult);

        expectedResult = [zrxWeth, wethZrx, daiWeth];
        expect(filterMarketsByString(markets, 'w')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'W')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'et')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'ET')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'eT')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'Et')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'eth')).toMatchObject(expectedResult);
        expect(filterMarketsByString(markets, 'ETH')).toMatchObject(expectedResult);
    });
});
