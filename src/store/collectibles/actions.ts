import { createAction, createAsyncAction } from 'typesafe-actions';

import { cancelSignedOrder } from '../../services/orders';
import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount, getGasPriceInWei } from '../selectors';

export const fetchAllCollectiblesAsync = createAsyncAction(
    'collectibles/ALL_COLLECTIBLES_fetch_request',
    'collectibles/ALL_COLLECTIBLES_fetch_success',
    'collectibles/ALL_COLLECTIBLES_fetch_failure',
)<
    void,
    {
        collectibles: Collectible[];
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
            dispatch(fetchAllCollectiblesAsync.success({ collectibles }));
        } catch (err) {
            dispatch(fetchAllCollectiblesAsync.failure(err));
        }
    };
};

export const cancelOrderCollectible: ThunkCreator = (order: any) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const gasPrice = getGasPriceInWei(state);

        const txPromise = cancelSignedOrder(order, gasPrice);

        // tslint:disable-next-line:no-floating-promises no-unsafe-any
        txPromise.then(transaction => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        });
    };
};
