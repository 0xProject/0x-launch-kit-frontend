import { createAction } from 'typesafe-actions';

import { Collectible } from '../../util/types';

export const setMyCollectibles = createAction('collectibles/MY_COLLECTIBLES_set', resolve => {
    return (myCollectibles: Collectible[]) => resolve(myCollectibles);
});
