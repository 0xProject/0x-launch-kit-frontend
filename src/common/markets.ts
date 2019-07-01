import { Filter } from '../util/types';

import { Config } from './config';

export const availableMarkets = Config.getConfig().pairs;
const allFilter = {
    text: 'ALL',
    value: null,
};
const suppliedMarketFilters = Config.getConfig().marketFilters;
export const marketFilters: Filter[] = suppliedMarketFilters ? [...suppliedMarketFilters, allFilter ] : [];
