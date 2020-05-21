import { BigNumber } from '@0x/utils';

import { DEFAULT_ORDER_EXPIRY_SECONDS } from '../common/constants';

export const tomorrow = () => {
    return new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
};

export const todayInSeconds = () => {
    return Math.floor(Date.now() / 1000);
};

export const convertTimeInSecondsToDaysAndHours = (timeInSeconds: BigNumber) => {
    let seconds = timeInSeconds.toNumber();
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    return {
        days,
        hours,
    };
};

export const getExpirationTimeOrdersFromConfig = () => {
    return new BigNumber(todayInSeconds()).plus(DEFAULT_ORDER_EXPIRY_SECONDS);
};

export const getEndDateStringFromTimeInSeconds = (timeInSeconds: BigNumber) => {
    const currentDate = new Date(timeInSeconds.toNumber() * 1000);
    return currentDate.toLocaleString('en-us');
};
