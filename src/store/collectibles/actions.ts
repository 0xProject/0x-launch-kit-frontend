import { createAsyncAction } from 'typesafe-actions';

import { Collectible, ThunkCreator } from '../../util/types';

export const fetchUserCollectiblesAsync = createAsyncAction(
    'collectibles/USER_COLLECTIBLES_fetch_request',
    'collectibles/USER_COLLECTIBLES_fetch_success',
    'collectibles/USER_COLLECTIBLES_fetch_failure',
)<void, Collectible[], Error>();

export const getUserCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, extraArgument) => {
        dispatch(fetchUserCollectiblesAsync.request());
        try {
            const collectiblesMetadataSource = extraArgument.getCollectiblesMetadataSource();
            const collectibles = await collectiblesMetadataSource.fetchUserCollectibles();
            dispatch(fetchUserCollectiblesAsync.success(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesAsync.failure(err));
        }
    };
};
