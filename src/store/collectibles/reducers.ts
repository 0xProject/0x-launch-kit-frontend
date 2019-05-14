import { getType } from 'typesafe-actions';

import { Collectible, CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialCollectibles: CollectiblesState = {
    userCollectibles: {},
    collectibleSelected: null,
    allCollectibles: {},
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.fetchAllCollectiblesAsync.success):
            const allCollectibles: { [key: string]: Collectible } = {};
            const userCollectibles: { [key: string]: Collectible } = {};

            // tslint:disable-next-line:no-shadowed-variable
            const { collectibles, ethAccount } = action.payload;
            collectibles.forEach(collectible => {
                allCollectibles[collectible.tokenId] = collectible;

                if (collectible.currentOwner.toLowerCase() === ethAccount.toLowerCase()) {
                    userCollectibles[collectible.tokenId] = collectible;
                }
            });
            return { ...state, allCollectibles, userCollectibles };
        case getType(actions.selectCollectible):
            return { ...state, collectibleSelected: action.payload };
        default:
            return state;
    }
}
