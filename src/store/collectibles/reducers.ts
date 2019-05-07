import { getType } from 'typesafe-actions';

import { CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
    userCollectibles: {},
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.fetchUserCollectiblesUpdate):
            const userCollectibles = {
                ...state.userCollectibles,
            };
            action.payload.forEach(collectible => {
                userCollectibles[collectible.tokenId] = collectible;
            });
            return { ...state, userCollectibles };
        default:
            return state;
    }
}
