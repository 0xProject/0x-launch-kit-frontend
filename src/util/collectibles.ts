import { BigNumber } from '0x.js';

import { getDutchAuctionData } from './orders';
import { todayInSeconds } from './time_utils';
import { Collectible } from './types';

export const getCollectiblePrice = (collectible: Collectible): BigNumber | null => {
    const { order } = collectible;
    if (order === null) {
        return null;
    }

    try {
        const dutchAcutionData = getDutchAuctionData(order.makerAssetData);
        const { beginAmount, beginTimeSeconds } = dutchAcutionData;
        const endAmount = order.takerAssetAmount;
        const startTimeSeconds = order.expirationTimeSeconds;
        // Use y = mx + b (linear function)
        const m = endAmount.minus(beginAmount).dividedBy(startTimeSeconds.minus(beginTimeSeconds));
        const b = beginAmount.minus(beginTimeSeconds.multipliedBy(m));
        return m.multipliedBy(todayInSeconds()).plus(b);
    } catch (err) {
        return order.takerAssetAmount;
    }
};
