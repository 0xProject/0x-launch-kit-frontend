import { SignedOrder } from '0x.js';
import { createAction, createAsyncAction } from 'typesafe-actions';

import { TX_DEFAULTS, ZERO_ADDRESS } from '../../common/constants';
import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount } from '../selectors';

export const fetchAllCollectiblesAsync = createAsyncAction(
    'collectibles/ALL_COLLECTIBLES_fetch_request',
    'collectibles/ALL_COLLECTIBLES_fetch_success',
    'collectibles/ALL_COLLECTIBLES_fetch_failure',
)<
    void,
    {
        collectibles: Collectible[];
        ethAccount: string;
    },
    Error
>();

export const selectCollectible = createAction('collectibles/selectCollectible', resolve => {
    return (collectible: Collectible | null) => resolve(collectible);
});

export const getAllCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, { getCollectiblesMetadataGateway, getWeb3Wrapper }) => {
        dispatch(fetchAllCollectiblesAsync.request());
        try {
            const state = getState();
            const web3Wrapper = await getWeb3Wrapper();
            const networkId = await web3Wrapper.getNetworkIdAsync();
            const ethAccount = getEthAccount(state);
            const collectiblesMetadataGateway = getCollectiblesMetadataGateway();
            const collectibles = await collectiblesMetadataGateway.fetchAllCollectibles(ethAccount, networkId);
            dispatch(fetchAllCollectiblesAsync.success({ collectibles, ethAccount }));
        } catch (err) {
            dispatch(fetchAllCollectiblesAsync.failure(err));
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
