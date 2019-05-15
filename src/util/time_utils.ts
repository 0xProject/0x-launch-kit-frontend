import { BigNumber } from '0x.js';

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
