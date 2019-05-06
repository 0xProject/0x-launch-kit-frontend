import { getType } from 'typesafe-actions';

import { Collectible, CollectiblesState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const myCollectibles: Collectible[] = [];

const initialCollectibles: CollectiblesState = {
    myCollectibles,
};

export function collectibles(state: CollectiblesState = initialCollectibles, action: RootAction): CollectiblesState {
    switch (action.type) {
        case getType(actions.setMyCollectibles):
            return { ...state, myCollectibles: action.payload };
        default:
            return state;
    }
}
