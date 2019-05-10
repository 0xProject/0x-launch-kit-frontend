import { createAction, createAsyncAction } from 'typesafe-actions';

import { Collectible, ThunkCreator } from '../../util/types';
import { toggleModalSellCollectible } from '../ui/actions';

export const fetchUserCollectiblesAsync = createAsyncAction(
    'collectibles/USER_COLLECTIBLES_fetch_request',
    'collectibles/USER_COLLECTIBLES_fetch_success',
    'collectibles/USER_COLLECTIBLES_fetch_failure',
)<void, Collectible[], Error>();

export const selectCollectible = createAction('collectibles/selectCollectible', resolve => {
    return (collectible: Collectible | null) => resolve(collectible);
});

export const updateSelectedCollectible: ThunkCreator = (collectible: Collectible) => {
    return async dispatch => {
        dispatch(selectCollectible(collectible));
        dispatch(toggleModalSellCollectible());
    };
};

export const getUserCollectibles: ThunkCreator = (userAddress: string) => {
    return async (dispatch, getState, { getCollectiblesMetadataSource }) => {
        dispatch(fetchUserCollectiblesAsync.request());
        try {
            const collectiblesMetadataSource = getCollectiblesMetadataSource();
            const collectibles = await collectiblesMetadataSource.fetchUserCollectibles(userAddress);
            dispatch(fetchUserCollectiblesAsync.success(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesAsync.failure(err));
        }
    };
};
