import { push } from 'connected-react-router';

import { ERC20APP_BASE_PATH } from '../../common/constants';

export const goToHome = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20APP_BASE_PATH}/`,
            }),
        );
    };
};

export const goToWallet = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20APP_BASE_PATH}/my-wallet`,
            }),
        );
    };
};
