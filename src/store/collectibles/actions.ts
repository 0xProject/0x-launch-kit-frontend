import { createAsyncAction } from 'typesafe-actions';

import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount, getNetworkId } from '../selectors';

export const fetchUserCollectiblesAsync = createAsyncAction(
    'collectibles/USER_COLLECTIBLES_fetch_request',
    'collectibles/USER_COLLECTIBLES_fetch_success',
    'collectibles/USER_COLLECTIBLES_fetch_failure',
)<void, Collectible[], Error>();

export const getUserCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, { getCollectiblesMetadataSource }) => {
        dispatch(fetchUserCollectiblesAsync.request());
        try {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const networkId = getNetworkId(state);
            const collectiblesMetadataSource = getCollectiblesMetadataSource();
            const collectibles = await collectiblesMetadataSource.fetchUserCollectibles(ethAccount, networkId);
            dispatch(fetchUserCollectiblesAsync.success(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesAsync.failure(err));
        }
    };
};
