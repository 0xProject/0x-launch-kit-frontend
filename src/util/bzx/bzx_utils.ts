import { iTokenData } from '../types';

/*
A user profit since last checkpoint
would be calculated like so: (tokenPrice()-checkpointPrice(user)) * balanceOf(user) / 10^36
@see https://docs.bzx.network/fulcrum-integration/lending#checkpointprice-address
*/
export const computeProfit = (iToken: iTokenData) => {
    return iToken.price.minus(iToken.checkpointPrice).multipliedBy(iToken.balance.dividedBy('1e36'));
};
