import { getType } from 'typesafe-actions';

import { CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
    userCollectibles: {},
    collectibleSelected: null,
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.fetchUserCollectiblesAsync.success):
            const userCollectibles = {
                ...state.userCollectibles,
            };
            action.payload.forEach(collectible => {
                userCollectibles[collectible.tokenId] = collectible;
            });
            return { ...state, userCollectibles };
        case getType(actions.selectCollectible):
            return { ...state, collectibleSelected: action.payload };
        default:
            return state;
    }
}
