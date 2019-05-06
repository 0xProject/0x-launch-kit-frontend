import { push } from 'connected-react-router';

import { ERC20_APP_BASE_PATH, ERC721_APP_BASE_PATH } from '../../common/constants';
import { ThunkCreator } from '../../util/types';

export const goToHome: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/`,
            }),
        );
    };
};

export const goToWallet: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/my-wallet`,
            }),
        );
    };
};

export const goToMyCollectibles = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC721_APP_BASE_PATH}/my-collectibles`,
            }),
        );
    };
};
