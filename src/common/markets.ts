import { mapCurrencyPairMetaToCurrencyPair } from '../util/currency_pair_meta_data';
import { Filter } from '../util/types';

import { Config } from './config';

export const availableMarkets = Config.getConfig().pairs.map(mapCurrencyPairMetaToCurrencyPair);

const allFilter = {
    text: 'ALL',
    value: null,
};
const suppliedMarketFilters = Config.getConfig().marketFilters;
export const marketFilters: Filter[] = suppliedMarketFilters ? [...suppliedMarketFilters, allFilter] : [];
