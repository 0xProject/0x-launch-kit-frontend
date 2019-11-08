import { getType } from 'typesafe-actions';

import { BZXLoadingState, BZXState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialBZXState: BZXState = {
    iTokensData: [],
    TokensList: [],
    bzxLoadingState: BZXLoadingState.Loading,
};

export function bzx(state: BZXState = initialBZXState, action: RootAction): BZXState {
    switch (action.type) {
        case getType(actions.initializeBZXData):
            return {
                ...state,
                ...action.payload,
            };
        case getType(actions.setITokenBalances):
            return { ...state, iTokensData: action.payload };
        case getType(actions.setBZXLoadingState):
            return { ...state, bzxLoadingState: action.payload };
        case getType(actions.setITokenBalance):
            const iToken = action.payload;
            const iTokensData = state.iTokensData;
            const index = iTokensData.findIndex(it => it.address === iToken.address);
            iTokensData[index] = iToken;
            return { ...state, iTokensData };
        default:
            return state;
    }
}
