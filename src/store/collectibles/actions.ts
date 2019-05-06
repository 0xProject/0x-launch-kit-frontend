import { createAction } from 'typesafe-actions';

import { getMyCollectibles } from '../../services/collectibles';
import { Collectible } from '../../util/types';

export const setMyCollectibles = createAction('collectibles/MY_COLLECTIBLES_set', resolve => {
    return (myCollectibles: Collectible[]) => resolve(myCollectibles);
});

export const getUserCollectibles = () => {
    return async (dispatch: any) => {
        const myCollectibles = getMyCollectibles();

        dispatch(setMyCollectibles(myCollectibles));
    };
};
