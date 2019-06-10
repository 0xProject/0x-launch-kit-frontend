import { BigNumber } from '0x.js';

export const tomorrow = () => {
    return new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
};
// Default to 7 days
export const getExpirationTimeOrdersFromConfig = () => {
    return new BigNumber(Math.floor(new Date().valueOf() / 1000) + (Number(process.env.REACT_APP_EXPIRE_ORDERS_TIME) || 3600 * 24 * 7) )    ;
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

export const getEndDateStringFromTimeInSeconds = (timeInSeconds: BigNumber) => {
    const currentDate = new Date(timeInSeconds.toNumber() * 1000);
    return currentDate.toLocaleString('en-us');
};
