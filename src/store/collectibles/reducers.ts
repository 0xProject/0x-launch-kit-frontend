import { getType } from 'typesafe-actions';

import { AllCollectiblesFetchStatus, Collectible, CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
    collectibleSelected: null,
    allCollectibles: {},
    allCollectiblesFetchStatus: AllCollectiblesFetchStatus.Request,
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.fetchAllCollectiblesAsync.success):
            const allCollectibles: { [key: string]: Collectible } = {};
            action.payload.collectibles.forEach(collectible => {
                allCollectibles[collectible.tokenId] = collectible;
            });
            const allCollectiblesFetchStatus = AllCollectiblesFetchStatus.Success;
            return { ...state, allCollectibles, allCollectiblesFetchStatus };
        case getType(actions.selectCollectible):
            return { ...state, collectibleSelected: action.payload };
        default:
            return state;
    }
}
