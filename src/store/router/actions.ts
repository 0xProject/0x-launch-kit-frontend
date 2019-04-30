import { push } from 'connected-react-router';

import { ThunkCreator } from '../../util/types';

export const goToHome: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: '/',
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
                pathname: '/my-wallet',
            }),
        );
    };
};
