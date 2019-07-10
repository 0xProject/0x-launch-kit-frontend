import {
    MAX_AMOUNT_TOKENS_IN_UNITS,
    UI_DECIMALS_DISPLAYED_ORDER_SIZE,
    UI_DECIMALS_DISPLAYED_PRICE_ETH,
} from '../common/constants';

import { CurrencyPair, CurrencyPairMetaData } from './types';

export const mapCurrencyPairMetaToCurrencyPair = (currencyPair: CurrencyPairMetaData): CurrencyPair => {
    if (currencyPair.config) {
        return {
            base: currencyPair.base,
            quote: currencyPair.quote,
            config: {
                basePrecision:
                    currencyPair.config.basePrecision !== undefined
                        ? currencyPair.config.basePrecision
                        : UI_DECIMALS_DISPLAYED_ORDER_SIZE,
                pricePrecision:
                    currencyPair.config.pricePrecision !== undefined
                        ? currencyPair.config.pricePrecision
                        : UI_DECIMALS_DISPLAYED_PRICE_ETH,
                minAmount: currencyPair.config.minAmount !== undefined ? currencyPair.config.minAmount : 0,
                maxAmount:
                    currencyPair.config.maxAmount !== undefined
                        ? currencyPair.config.maxAmount
                        : MAX_AMOUNT_TOKENS_IN_UNITS,
                quotePrecision:
                    currencyPair.config.quotePrecision !== undefined
                        ? currencyPair.config.quotePrecision
                        : UI_DECIMALS_DISPLAYED_PRICE_ETH,
            },
        };
    } else {
        return {
            base: currencyPair.base,
            quote: currencyPair.quote,
            config: {
                basePrecision: UI_DECIMALS_DISPLAYED_ORDER_SIZE,
                pricePrecision: UI_DECIMALS_DISPLAYED_PRICE_ETH,
                minAmount: 0,
                maxAmount: MAX_AMOUNT_TOKENS_IN_UNITS,
                quotePrecision: UI_DECIMALS_DISPLAYED_PRICE_ETH,
            },
        };
    }
};
