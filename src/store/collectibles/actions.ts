import { createAsyncAction } from 'typesafe-actions';

import { fetchUserCollectibles } from '../../services/collectibles';
import { Collectible, ThunkCreator } from '../../util/types';

export const fetchUserCollectiblesAsync = createAsyncAction(
    'collectibles/USER_COLLECTIBLES_fetch_request',
    'collectibles/USER_COLLECTIBLES_fetch_success',
    'collectibles/USER_COLLECTIBLES_fetch_failure',
)<void, Collectible[], Error>();

export const getUserCollectibles: ThunkCreator = () => {
    return async dispatch => {
        dispatch(fetchUserCollectiblesAsync.request());
        try {
            const collectibles = await fetchUserCollectibles();
            dispatch(fetchUserCollectiblesAsync.success(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesAsync.failure(err));
        }
    };
};
