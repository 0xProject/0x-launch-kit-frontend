import { BigNumber } from '@0x/utils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ZERO } from '../../../common/constants';
import { toggleTokenLock, updateWethBalance } from '../../../store/blockchain/actions';
import { addressFactory, tokenFactory } from '../../../util/test-utils';

const web3Wrapper = {
    awaitTransactionSuccessAsync: jest.fn().mockResolvedValue(''),
    getBalanceInWeiAsync: jest.fn().mockResolvedValue(ZERO),
    getNetworkIdAsync: jest.fn().mockResolvedValue(50),
};

const depositMockSendTx = jest.fn();
const withdrawMockSendTx = jest.fn();
const approveMockSendTx = jest.fn();
const contractWrappers = {
    erc20Token: {
        approve: jest.fn(() => ({
            sendTransactionAsync: jest.fn(),
        })),
    },
    erc20Proxy: {
        address: '0x0000000000000000000000000000000000000001',
    },
    weth9: {
        approve: jest.fn(() => ({ sendTransactionAsync: approveMockSendTx })),
        deposit: jest.fn(() => ({ sendTransactionAsync: depositMockSendTx })),
        withdraw: jest.fn(() => ({ sendTransactionAsync: withdrawMockSendTx })),
    },
    getProvider: () => ({ isStandardizedProvider: true }),
};

const mockStore = configureMockStore([
    thunk.withExtraArgument({
        getWeb3Wrapper: jest.fn().mockResolvedValue(web3Wrapper),
        getContractWrappers: jest.fn().mockResolvedValue(contractWrappers),
    }),
]);

describe('blockchain actions', () => {
    describe('toggleTokenLock', () => {
        it.skip('should set the allowance to 0 when the token is unlocked', async () => {
            // HACK(dekz) skipped as erc20Token no longer exists on contractWrappers
            // given
            const tx = 'some-tx';
            contractWrappers.erc20Token.approve().sendTransactionAsync.mockResolvedValueOnce(tx);
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
            expect(contractWrappers.erc20Token.approve().sendTransactionAsync).toHaveBeenCalled();
            expect(contractWrappers.erc20Token.approve.mock.calls[0][0]).toEqual(token.address);
            expect(contractWrappers.erc20Token.approve().sendTransactionAsync.mock.calls[0][1]).toEqual(ZERO);
            expect(result).toEqual(tx);
        });
    });
    describe('updateWethBalance', () => {
        it('should convert eth to weth', async () => {
            // given
            const tx = 'some-tx';
            contractWrappers.weth9.deposit().sendTransactionAsync.mockResolvedValueOnce(tx);
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
            expect(contractWrappers.weth9.deposit().sendTransactionAsync.mock.calls[0][0].value).toEqual(
                new BigNumber(4),
            );
            expect(result).toEqual(tx);
        });
    });
});
