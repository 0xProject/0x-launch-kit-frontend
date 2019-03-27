import { BigNumber } from '0x.js';

import {
    DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
    DEFAULT_GAS_PRICE,
    ETH_GAS_STATION_API_BASE_URL,
    GWEI_IN_WEI,
} from '../common/constants';

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

interface GasInfo {
    gasPriceInWei: BigNumber;
    estimatedTimeMs: number;
}

let fetchedAmount: GasInfo | undefined;
export const getGasEstimationInfoAsync = async (): Promise<GasInfo> => {
    try {
        fetchedAmount = await fetchFastAmountInWeiAsync();
        return (
            fetchedAmount || {
                gasPriceInWei: DEFAULT_GAS_PRICE,
                estimatedTimeMs: DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
            }
        );
    } catch (e) {
        fetchedAmount = undefined;
        return Promise.reject('Could not get gas price');
    }
};

const fetchFastAmountInWeiAsync = async (): Promise<GasInfo> => {
    const res = await fetch(`${ETH_GAS_STATION_API_BASE_URL}/json/ethgasAPI.json`);
    const gasInfo = (await res.json()) as EthGasStationResult;
    // Eth Gas Station result is gwei * 10
    const gasPriceInGwei = new BigNumber(gasInfo.fast / 10);
    // Time is in minutes
    const estimatedTimeMs = gasInfo.fastWait * 60 * 1000; // Minutes to MS
    return { gasPriceInWei: gasPriceInGwei.mul(GWEI_IN_WEI), estimatedTimeMs };
};
