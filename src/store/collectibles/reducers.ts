import { getType } from 'typesafe-actions';

import { Collectible, CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
    collectibleSelected: null,
    allCollectibles: {},
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.fetchAllCollectiblesAsync.success):
            const allCollectibles: { [key: string]: Collectible } = {};
            action.payload.collectibles.forEach(collectible => {
                allCollectibles[collectible.tokenId] = collectible;
            });
            return { ...state, allCollectibles };
        case getType(actions.selectCollectible):
            return { ...state, collectibleSelected: action.payload };
        default:
            return state;
    }
}
