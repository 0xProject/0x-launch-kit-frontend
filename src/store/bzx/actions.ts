import { BigNumber } from '@0x/utils';
import { createAction } from 'typesafe-actions';

import { getAllITokens, getToken } from '../../services/bzx';
import { getLogger } from '../../util/logger';
import { getTransactionOptions } from '../../util/transactions';
import { BZXLoadingState, BZXState, iTokenData, NotificationKind, ThunkCreator, Token } from '../../util/types';
import { addNotifications, updateTokenBalances } from '../actions';
import { getEthAccount, getGasPriceInWei } from '../selectors';

const logger = getLogger('BZX::Actions');

export const initializeBZXData = createAction('bzx/init', resolve => {
    return (bzxData: Partial<BZXState>) => resolve(bzxData);
});

export const setBZXLoadingState = createAction('bzx/BZX_LOADING_STATE_set', resolve => {
    return (bzxLoadingState: BZXLoadingState) => resolve(bzxLoadingState);
});

export const setITokenBalance = createAction('bzx/ITOKEN_BALANCE_set', resolve => {
    return (token: iTokenData) => resolve(token);
});

export const setITokenBalances = createAction('bzx/ITOKEN_BALANCES_set', resolve => {
    return (token: iTokenData[]) => resolve(token);
});

export const initBZX: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        dispatch(setBZXLoadingState(BZXLoadingState.Loading));
        try {
            const [iTokens, tokens] = await getAllITokens(ethAccount);
            await dispatch(updateTokenBalances());
            dispatch(
                initializeBZXData({
                    TokensList: tokens,
                    iTokensData: iTokens,
                }),
            );
            dispatch(setBZXLoadingState(BZXLoadingState.Done));
        } catch (error) {
            logger.error('There was an error when initializing bzx smartcontracts', error);
            dispatch(setBZXLoadingState(BZXLoadingState.Error));
        }
    };
};

export const fetchBZX: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        try {
            const [iTokens, tokens] = await getAllITokens(ethAccount);
            dispatch(
                initializeBZXData({
                    TokensList: tokens,
                    iTokensData: iTokens,
                }),
            );
        } catch (error) {
            logger.error('There was an error when fetching bzx smartcontracts', error);
        }
    };
};

export const lendingToken: ThunkCreator<Promise<any>> = (
    token: Token,
    iToken: iTokenData,
    amount: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper, getITokenContractWrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const iContractWrappers = await getITokenContractWrapper(iToken.address, {
            from: ethAccount.toLowerCase(),
            gas: '2000000',
        });
        const web3Wrapper = await getWeb3Wrapper();
        let txHash: string;
        if (isEth) {
            txHash = await iContractWrappers.mintWithEther(ethAccount.toLowerCase()).sendTransactionAsync({
                from: ethAccount.toLowerCase(),
                value: amount.toString(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });
        } else {
            txHash = await iContractWrappers.mint(ethAccount, amount).sendTransactionAsync({
                from: ethAccount.toLowerCase(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });
        }

        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.LendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );
        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/

        return txHash;
    };
};

export const unLendingToken: ThunkCreator<Promise<any>> = (
    token: Token,
    iToken: iTokenData,
    amount: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper, getITokenContractWrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const iContractWrappers = await getITokenContractWrapper(iToken.address, {
            from: ethAccount.toLowerCase(),
            gas: '2500000',
        });
        const web3Wrapper = await getWeb3Wrapper();
        let txHash: string;

        if (isEth) {
            /*
           TODO Investigate why this is not working
           txHash = await iContractWrappers.burnToEther.sendTransactionAsync(ethAccount.toLowerCase(), amount, {
                from: ethAccount.toLowerCase(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });*/
            txHash = await iContractWrappers.burn(ethAccount.toLowerCase(), amount).sendTransactionAsync({
                from: ethAccount.toLowerCase(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });
        } else {
            txHash = await iContractWrappers.burn(ethAccount, amount).sendTransactionAsync();
        }

        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.UnLendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );

        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/
        // tslint:disable-next-line: no-floating-promises

        return txHash;
    };
};

export const updateITokenBalance: ThunkCreator<Promise<any>> = (iToken: iTokenData) => {
    return async (dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        dispatch(setBZXLoadingState(BZXLoadingState.Loading));
        const token = await getToken(ethAccount, iToken);
        if (token) {
            dispatch(setITokenBalance(token));
        }
        dispatch(setBZXLoadingState(BZXLoadingState.Done));
    };
};
