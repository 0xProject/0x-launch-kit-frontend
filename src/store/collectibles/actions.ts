import { createAction } from 'typesafe-actions';

import { fetchUserCollectibles } from '../../services/collectibles';
import { Collectible, ThunkCreator } from '../../util/types';

export const fetchUserCollectiblesStart = createAction('collectibles/USER_COLLECTIBLES_fetch_request', resolve => {
    return () => resolve();
});

export const fetchUserCollectiblesUpdate = createAction('collectibles/USER_COLLECTIBLES_fetch_success', resolve => {
    return (collectibles: Collectible[]) => resolve(collectibles);
});

export const fetchUserCollectiblesError = createAction('collectibles/USER_COLLECTIBLES_fetch_failure', resolve => {
    return (payload: any) => resolve(payload);
});

export const getUserCollectibles: ThunkCreator = () => {
    return async dispatch => {
        dispatch(fetchUserCollectiblesStart());
        try {
            const collectibles = await fetchUserCollectibles();
            dispatch(fetchUserCollectiblesUpdate(collectibles));
        } catch (err) {
            dispatch(fetchUserCollectiblesError(err));
        }
    };
};
