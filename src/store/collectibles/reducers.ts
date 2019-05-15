import { getType } from 'typesafe-actions';

import { Collectible, CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
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
        default:
            return state;
    }
}
