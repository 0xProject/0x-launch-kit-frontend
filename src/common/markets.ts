import { mapCurrencyPairMetaToCurrencyPair } from '../util/currency_pair_meta_data';
import { CurrencyPair, CurrencyPairMetaData, Filter } from '../util/types';

import { Config } from './config';

let availableMarkets: CurrencyPair[] = [];

const allFilter = {
    text: 'ALL',
    value: null,
};
const suppliedMarketFilters = Config.getConfig().marketFilters;
export const marketFilters: Filter[] = suppliedMarketFilters ? [...suppliedMarketFilters, allFilter] : [];

export const updateAvailableMarkets = (pairs: CurrencyPairMetaData[]) => {
    availableMarkets = pairs.map(mapCurrencyPairMetaToCurrencyPair);
    return availableMarkets;
};

export const getAvailableMarkets = (): CurrencyPair[] => {
    if (!availableMarkets.length) {
        availableMarkets = Config.getConfig().pairs.map(mapCurrencyPairMetaToCurrencyPair);
    }
    return availableMarkets;
};
