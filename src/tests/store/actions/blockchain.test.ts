import { BigNumber } from '0x.js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { toggleTokenLock, updateWethBalance } from '../../../store/blockchain/actions';
import { addressFactory, tokenFactory } from '../../../util/test-utils';

const web3Wrapper = {
    awaitTransactionSuccessAsync: jest.fn().mockResolvedValue(''),
    getBalanceInWeiAsync: jest.fn().mockResolvedValue(new BigNumber(0)),
    getNetworkIdAsync: jest.fn().mockResolvedValue(50),
};

const contractWrappers = {
    erc20Token: {
        setProxyAllowanceAsync: jest.fn(),
        setUnlimitedProxyAllowanceAsync: jest.fn(),
    },
    etherToken: {
        depositAsync: jest.fn(),
    },
};

const mockStore = configureMockStore([
    thunk.withExtraArgument({
        getWeb3Wrapper: jest.fn().mockResolvedValue(web3Wrapper),
        getContractWrappers: jest.fn().mockResolvedValue(contractWrappers),
    }),
]);

describe('blockchain actions', () => {
    describe('toggleTokenLock', () => {
        it('should set the allowance to 0 when the token is unlocked', async () => {
            // given
            const tx = 'some-tx';
            contractWrappers.erc20Token.setProxyAllowanceAsync.mockResolvedValueOnce(tx);
            const token = tokenFactory.build();
            const ethAccount = addressFactory.build().address;
            const store = mockStore({
                blockchain: {
                    ethAccount,
                    gasInfo: {
                        gasPriceInWei: new BigNumber(1),
                    },
                },
            });

            // when
            const result = await store.dispatch(toggleTokenLock(token, true) as any);

            // then
            expect(contractWrappers.erc20Token.setProxyAllowanceAsync).toHaveBeenCalled();
            expect(contractWrappers.erc20Token.setProxyAllowanceAsync.mock.calls[0][0]).toEqual(token.address);
            expect(contractWrappers.erc20Token.setProxyAllowanceAsync.mock.calls[0][1]).toEqual(ethAccount);
            expect(contractWrappers.erc20Token.setProxyAllowanceAsync.mock.calls[0][2]).toEqual(new BigNumber(0));
            expect(result).toEqual(tx);
        });
    });
    describe('updateWethBalance', () => {
        it('should convert eth to weth', async () => {
            // given
            const tx = 'some-tx';
            contractWrappers.etherToken.depositAsync.mockResolvedValueOnce(tx);
            const store = mockStore({
                blockchain: {
                    ethBalance: new BigNumber(10),
                    gasInfo: {
                        gasPriceInWei: new BigNumber(1),
                    },
                    wethTokenBalance: {
                        balance: new BigNumber(1),
                        isUnlocked: true,
                        token: {},
                    },
                },
            });

            // when
            const result = await store.dispatch(updateWethBalance(new BigNumber(5)) as any);

            // then
            expect(contractWrappers.etherToken.depositAsync.mock.calls[0][1]).toEqual(new BigNumber(4));
            expect(result).toEqual(tx);
        });
    });
});
