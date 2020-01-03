import { BigNumber } from '@0x/utils';

import {
    filterMarketsByString,
    filterMarketsByTokenSymbol,
    getLastPrice,
    getTodayClosedOrdersFromFills,
    getTodayFillsUTC,
    getTodayHighPriceFromFills,
    getTodayLowerPriceFromFills,
    getTodayVolumeFromFills,
} from '../../util/markets';
import { createFill } from '../../util/test-utils';

const config = {
    basePrecision: 8,
    pricePrecision: 8,
    quotePrecision: 8,
    minAmount: 0,
    maxAmount: 1000000,
};

const marketData = {
    spreadInPercentage: new BigNumber(1),
    bestAsk: new BigNumber(1),
    bestBid: new BigNumber(1),
};

const marketExamples = {
    zrxWeth: {
        currencyPair: {
            base: 'zrx',
            quote: 'weth',
            config,
        },
        price: null,
        ...marketData,
    },
    wethZrx: {
        currencyPair: {
            base: 'weth',
            quote: 'zrx',
            config,
        },
        price: null,
        ...marketData,
    },
    daiMkr: {
        currencyPair: {
            base: 'dai',
            quote: 'mkr',
            config,
        },
        price: null,
        ...marketData,
    },
    daiWeth: {
        currencyPair: {
            base: 'dai',
            quote: 'weth',
            config,
        },
        price: null,
        ...marketData,
    },
};
const { zrxWeth, wethZrx, daiMkr, daiWeth } = marketExamples;

describe('filterMarketsByTokenSymbol', () => {
    it('should return [] when the are no CurrencyPair with the given TokenSymbol', async () => {
        const markets = [zrxWeth, wethZrx, daiWeth];
        expect(filterMarketsByTokenSymbol(markets, 'mkr')).toMatchObject([]);
        expect(filterMarketsByTokenSymbol([], 'mkr')).toMatchObject([]);
    });
    it('should return an array with results that have the given TokenSymbol as base or quote in their market.currencyPair', async () => {
        let markets = [zrxWeth, wethZrx, daiMkr];
        let expectedResult = [zrxWeth, wethZrx];
        expect(filterMarketsByTokenSymbol(markets, 'zrx')).toMatchObject(expectedResult);
        expect(filterMarketsByTokenSymbol(markets, 'weth')).toMatchObject(expectedResult);

        markets = [zrxWeth, wethZrx, daiMkr, daiWeth];
        expectedResult = [zrxWeth, wethZrx, daiWeth];
        expect(filterMarketsByTokenSymbol(markets, 'weth')).toMatchObject(expectedResult);
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

describe('marketStats', () => {
    it('get last price from fills', async () => {
        const fill = createFill();
        const lastPrice = getLastPrice([fill]);
        expect(lastPrice).toBe(fill.price);
    });

    it('get today fills UTC', async () => {
        const fill = createFill();
        const todayFills = getTodayFillsUTC([fill]);
        expect(todayFills).toMatchObject([fill]);
    });

    it('get today volume from fills', async () => {
        const fill1 = createFill();
        const fill2 = createFill();
        const todayVolume = getTodayVolumeFromFills([fill1, fill2]);
        expect(todayVolume).toMatchObject(fill1.amountBase.plus(fill2.amountBase));
    });
    it('get today High Price from fills', async () => {
        const fill1 = createFill();
        const fill2 = createFill(new BigNumber(10), new BigNumber(1));
        const higherPrice = getTodayHighPriceFromFills([fill1, fill2]);
        expect(higherPrice && higherPrice.toString()).toBe(fill1.price);
    });
    it('get today Lower Price from fills', async () => {
        const fill1 = createFill();
        const fill2 = createFill(new BigNumber(10), new BigNumber(1));
        const lowerPrice = getTodayLowerPriceFromFills([fill1, fill2]);
        expect(lowerPrice && lowerPrice.toString()).toBe(fill2.price);
    });
    it('get today closed orders', async () => {
        const fill1 = createFill();
        const fill2 = createFill(new BigNumber(10), new BigNumber(1));
        const closedOrders = getTodayClosedOrdersFromFills([fill1, fill2]);
        expect(closedOrders).toBe(2);
    });
});
