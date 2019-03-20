import { push } from 'connected-react-router';

export const goToHome = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: '/',
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
                pathname: '/my-wallet',
            }),
        );
    };
};
