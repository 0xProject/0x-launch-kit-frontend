import {
    MAX_AMOUNT_TOKENS_IN_UNITS,
    UI_DECIMALS_DISPLAYED_ORDER_SIZE,
    UI_DECIMALS_DISPLAYED_PRICE_ETH,
} from '../../common/constants';
import { mapCurrencyPairMetaToCurrencyPair } from '../../util/currency_pair_meta_data';
import { getCurrencyPairByTokensSymbol } from '../../util/known_currency_pairs';
import { CurrencyPair, CurrencyPairMetaData } from '../../util/types';

const currencyPairsMetaDataDemo: CurrencyPairMetaData[] = [
    {
        base: 'vsf',
        quote: 'zrx',
    },
];
const currencyPairsMetaDataDemoWithConfig: CurrencyPairMetaData[] = [
    {
        base: 'vsf',
        quote: 'zrx',
        config: {
            basePrecision: 10,
            pricePrecision: 20,
            minAmount: 30,
            maxAmount: 40,
            quotePrecision: 50,
        },
    },
];

const currencyPairDemo: CurrencyPair[] = [
    {
        base: 'vsf',
        quote: 'zrx',
        config: {
            basePrecision: UI_DECIMALS_DISPLAYED_ORDER_SIZE,
            pricePrecision: UI_DECIMALS_DISPLAYED_PRICE_ETH,
            minAmount: 0,
            maxAmount: MAX_AMOUNT_TOKENS_IN_UNITS,
            quotePrecision: UI_DECIMALS_DISPLAYED_PRICE_ETH,
        },
    },
];

describe('getKnownCurrencyPairs', () => {
    it('should map currencyPairMetaData to CurrencyPair without configs', () => {
        const currencyPairs = currencyPairsMetaDataDemo.map(mapCurrencyPairMetaToCurrencyPair);
        expect(currencyPairs).toBeTruthy();
    });
    it('should map currencyPairMetaData to CurrencyPair without configs', () => {
        const currencyPairs = currencyPairsMetaDataDemo.map(mapCurrencyPairMetaToCurrencyPair);
        expect(currencyPairs).toEqual(currencyPairDemo);
    });
    it('should map currencyPairMetaData to CurrencyPair with configs', () => {
        const currencyPairs = currencyPairsMetaDataDemoWithConfig.map(mapCurrencyPairMetaToCurrencyPair);
        expect(currencyPairs).toEqual(currencyPairsMetaDataDemoWithConfig);
    });
    it('should find currency pair by token symbols', () => {
        const currencyPairs = getCurrencyPairByTokensSymbol('zrx', 'weth');
        expect(currencyPairs).toBeTruthy();
    });
});
