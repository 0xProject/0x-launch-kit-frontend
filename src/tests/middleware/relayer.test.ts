// tslint:disable:no-object-literal-type-assertion

import { BigNumber, SignedOrder } from '0x.js';
import configureMockStore from 'redux-mock-store';
import { getType } from 'typesafe-actions';

import * as actions from '../../store/actions';
import { relayerMiddleware } from '../../store/middleware/relayer';
import { OrderSide, Token } from '../../util/types';

const client = {
    submitOrderAsync: jest.fn(),
};

describe('relayer middleware', () => {
    afterEach(() => {
        client.submitOrderAsync.mockReset();
    });

    it('should successfully submit the order', async () => {
        // given
        const mockStore = configureMockStore([relayerMiddleware(client as any)]);
        const store = mockStore({});
        const signedOrder = {} as SignedOrder;

        // when
        const action = actions.submitLimitOrder.request({
            amount: new BigNumber(1),
            baseToken: {} as Token,
            side: OrderSide.Buy,
            signedOrder,
        });
        await store.dispatch(action);

        // then
        expect(client.submitOrderAsync.mock.calls.length).toBe(1);
        expect(client.submitOrderAsync.mock.calls[0][0]).toBe(signedOrder);

        const dispatchedActions = store.getActions();
        expect(dispatchedActions.map((x: any) => x.type)).toEqual([
            getType(actions.submitLimitOrder.request),
            getType(actions.submitLimitOrder.success),
            getType(actions.addNotifications),
        ]);
    });

    it('should indicate if something fails', async () => {
        // given
        client.submitOrderAsync.mockRejectedValue(new Error('error'));
        const mockStore = configureMockStore([relayerMiddleware(client as any)]);
        const store = mockStore({});
        const signedOrder = {} as any;

        // when
        const action = actions.submitLimitOrder.request({
            amount: new BigNumber(1),
            baseToken: {} as Token,
            side: OrderSide.Buy,
            signedOrder,
        });
        const result = (store.dispatch(action) as any) as Promise<any>;
        await result.catch(e => {
            expect(e.message).toEqual('error');
        });

        // then
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.map((x: any) => x.type)).toEqual([
            getType(actions.submitLimitOrder.request),
            getType(actions.submitLimitOrder.failure),
        ]);
        expect(dispatchedActions[1].payload.message).toEqual('error');
    });
});
