import { BigNumber } from '0x.js';

export const tomorrow = () => {
    return new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
};

export const todayInSeconds = () => {
    return Math.floor(Date.now() / 1000);
};
