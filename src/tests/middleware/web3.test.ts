// tslint:disable:no-object-literal-type-assertion

import { BigNumber, SignedOrder } from '0x.js';
import configureMockStore from 'redux-mock-store';
import { getType } from 'typesafe-actions';

import * as actions from '../../store/actions';
import { createWeb3Middleware } from '../../store/middleware/web3';
import { addressFactory } from '../../util/test-utils';
import { OrderSide, Token } from '../../util/types';

const connectedUser = addressFactory.build().address;
const mockWeb3Wrapper = {
    getAvailableAddressesAsync: jest.fn().mockResolvedValue([connectedUser]),
};

describe('web3 middleware', () => {
    afterEach(() => {
        mockWeb3Wrapper.getAvailableAddressesAsync.mockReset();
    });

    it('should indicate that web3 is not available', async () => {
        // given
        const options = {
            window: {
                ethereum: undefined,
                location: {} as any,
                web3: undefined,
            },
            getWeb3Wrapper: () => mockWeb3Wrapper as any,
        };
        const mockStore = configureMockStore([createWeb3Middleware(options)]);
        const store = mockStore({});

        // when
        await store.dispatch(actions.init());

        // then
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.map((x: any) => x.type)).toEqual([
            getType(actions.init),
            getType(actions.web3NotInstalled),
        ]);
    });

    it('should enable web3', async () => {
        // given
        const connectedAccount = addressFactory.build().address;
        const options = {
            window: {
                ethereum: {
                    enable: jest.fn().mockImplementation(() => Promise.resolve()),
                    on: jest.fn(),
                },
                location: {} as any,
                web3: undefined,
            },
            getWeb3Wrapper: () => mockWeb3Wrapper as any,
        };
        const mockStore = configureMockStore([createWeb3Middleware(options)]);
        const store = mockStore({});

        // when
        await store.dispatch(actions.connectWeb3.request());

        // then
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.map((x: any) => x.type)).toEqual([
            getType(actions.connectWeb3.request),
            getType(actions.connectWeb3.success),
        ]);
    });
});
