import { BigNumber } from '0x.js';
import { RateLimit } from 'async-sema';

import {
    DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
    DEFAULT_GAS_PRICE,
    ETH_GAS_STATION_API_BASE_URL,
    GWEI_IN_WEI,
} from '../common/constants';
import { getLogger } from '../util/logger';
import { GasInfo } from '../util/types';

interface EthGasStationResult {
    average: number;
    fastestWait: number;
    fastWait: number;
    fast: number;
    safeLowWait: number;
    blockNum: number;
    avgWait: number;
    block_time: number;
    speed: number;
    fastest: number;
    safeLow: number;
}

const logger = getLogger('Gas Estimation from ethgasAPI::gas_price_estimation.ts');

export const getGasEstimationInfoAsync = async (): Promise<GasInfo> => {
    let fetchedAmount: GasInfo | undefined;

    const lim = RateLimit(1);

    try {
        await lim();
        fetchedAmount = await fetchFastAmountInWeiAsync();
    } catch (e) {
        fetchedAmount = undefined;
    }

    logger.info(fetchedAmount);

    return (
        fetchedAmount || {
            gasPriceInWei: DEFAULT_GAS_PRICE,
            estimatedTimeMs: DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
        }
    );
};

const fetchFastAmountInWeiAsync = async (): Promise<GasInfo> => {
    const res = await fetch(`${ETH_GAS_STATION_API_BASE_URL}/json/ethgasAPI.json`);
    const gasInfo = (await res.json()) as EthGasStationResult;
    // Eth Gas Station result is gwei * 10
    const gasPriceInGwei = new BigNumber(gasInfo.fast / 10);
    // Time is in minutes
    const estimatedTimeMs = gasInfo.fastWait * 60 * 1000; // Minutes to MS
    return { gasPriceInWei: gasPriceInGwei.multipliedBy(GWEI_IN_WEI), estimatedTimeMs };
};
