import { SignedOrder } from '0x.js';
import { createAction, createAsyncAction } from 'typesafe-actions';

import { TX_DEFAULTS, ZERO_ADDRESS } from '../../common/constants';
import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount, getNetworkId } from '../selectors';

export const fetchUserCollectiblesAsync = createAsyncAction(
    'collectibles/USER_COLLECTIBLES_fetch_request',
    'collectibles/USER_COLLECTIBLES_fetch_success',
    'collectibles/USER_COLLECTIBLES_fetch_failure',
)<void, Collectible[], Error>();

export const selectCollectible = createAction('collectibles/selectCollectible', resolve => {
    return (collectible: Collectible | null) => resolve(collectible);
});

export const getUserCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, { getCollectiblesMetadataGateway }) => {
        dispatch(fetchUserCollectiblesAsync.request());
        try {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const networkId = getNetworkId(state);
            const collectiblesMetadataGateway = getCollectiblesMetadataGateway();
            const collectibles = await collectiblesMetadataGateway.fetchUserCollectibles(ethAccount, networkId);
            dispatch(fetchUserCollectiblesAsync.success(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesAsync.failure(err));
        }
    };
};

const isDutchAuction = (order: SignedOrder) => {
    return false;
};

export const submitBuyCollectible: ThunkCreator = (order: SignedOrder, ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const contractWrappers = await getContractWrappers();

        if (isDutchAuction(order)) {
            throw new Error('not implemented');
        } else {
            contractWrappers.forwarder.marketBuyOrdersWithEthAsync(
                [order],
                order.makerAssetAmount,
                ethAccount,
                order.takerAssetAmount,
                [],
                0,
                ZERO_ADDRESS,
                TX_DEFAULTS,
            );
        }
    };
};
