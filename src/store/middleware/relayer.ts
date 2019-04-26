import { HttpClient } from '@0x/connect';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getType } from 'typesafe-actions';

import { RelayerException } from '../../exceptions/relayer_exception';
import { NotificationKind, StoreState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

export const relayerMiddleware: (client: HttpClient) => Middleware = (client: HttpClient) => ({
    dispatch,
    getState,
}: MiddlewareAPI<ThunkDispatch<StoreState, {}, AnyAction>, StoreState>) => (next: Dispatch) => {
    return async (action: RootAction) => {
        const result = next(action);

        switch (action.type) {
            case getType(actions.submitLimitOrder.request): {
                try {
                    const { amount, baseToken, side, signedOrder } = action.payload;
                    await client.submitOrderAsync(signedOrder);
                    dispatch(actions.submitLimitOrder.success());
                    dispatch(actions.getOrderbookAndUserOrders()); // tslint:disable-line:no-floating-promises
                    dispatch(
                        actions.addNotifications([
                            {
                                id: signedOrder.signature,
                                kind: NotificationKind.Limit,
                                amount,
                                token: baseToken,
                                side,
                                timestamp: new Date(),
                            },
                        ]),
                    );
                } catch (e) {
                    dispatch(actions.submitLimitOrder.failure(e));
                    throw new RelayerException(e.message);
                }
                return result;
            }
        }

        return result;
    };
};
