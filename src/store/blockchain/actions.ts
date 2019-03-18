import { BigNumber, DecodedLogEvent, ExchangeEvents, ExchangeFillEventArgs } from '0x.js';
import { createAction } from 'typesafe-actions';

import {
    MAINNET_ID,
    METAMASK_NOT_INSTALLED,
    METAMASK_USER_DENIED_AUTH,
    TX_DEFAULTS,
    WETH_TOKEN_SYMBOL,
} from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { tokenToTokenBalance } from '../../services/tokens';
import { getWeb3WrapperOrThrow, reconnectWallet } from '../../services/web3_wrapper';
import { getKnownTokens } from '../../util/known_tokens';
import { buildOrderFilledNotification } from '../../util/notifications';
import { BlockchainState, TokenBalance, Web3State } from '../../util/types';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import { getEthAccount, getTokenBalances, getWethBalance, getWethTokenBalance } from '../selectors';
import { addNotification } from '../ui/actions';

export const initializeBlockchainData = createAction('INITIALIZE_BLOCKCHAIN_DATA', resolve => {
    return (blockchainData: Partial<BlockchainState>) => resolve(blockchainData);
});

export const setEthAccount = createAction('SET_ETH_ACCOUNT', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction('SET_WEB3_STATE', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction('SET_TOKEN_BALANCES', resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setEthBalance = createAction('SET_ETH_BALANCE', resolve => {
    return (ethBalance: BigNumber) => resolve(ethBalance);
});

export const setWethBalance = createAction('SET_WETH_BALANCE', resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setWethTokenBalance = createAction('SET_WETH_TOKEN_BALANCE', resolve => {
    return (wethTokenBalance: TokenBalance | null) => resolve(wethTokenBalance);
});

export const toggleTokenLock = ({ token, isUnlocked }: TokenBalance) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);

        const contractWrappers = await getContractWrappers();

        if (isUnlocked) {
            await contractWrappers.erc20Token.setProxyAllowanceAsync(
                token.address,
                ethAccount,
                new BigNumber('0'),
                TX_DEFAULTS,
            );
        } else {
            await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);
        }

        const isWeth = token.symbol === WETH_TOKEN_SYMBOL;
        if (isWeth) {
            const wethTokenBalance = getWethTokenBalance(state) as TokenBalance;
            dispatch(
                setWethTokenBalance({
                    ...wethTokenBalance,
                    isUnlocked: !isUnlocked,
                }),
            );
        } else {
            const tokenBalances = getTokenBalances(state);
            const updatedTokenBalances = tokenBalances.map(tokenBalance => {
                if (tokenBalance.token.address !== token.address) {
                    return tokenBalance;
                }

                return {
                    ...tokenBalance,
                    isUnlocked: !isUnlocked,
                };
            });

            dispatch(setTokenBalances(updatedTokenBalances));
        }
    };
};

export const updateWethBalance = (newWethBalance: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const wethTokenBalance = getWethTokenBalance(state);
        const wethBalance = getWethBalance(state);

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const wethAddress = getKnownTokens(networkId).getWethToken().address;

        const contractWrappers = await getContractWrappers();

        let tx: string;
        if (wethBalance.lessThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.depositAsync(
                wethAddress,
                newWethBalance.sub(wethBalance),
                ethAccount,
            );
        } else if (wethBalance.greaterThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.withdrawAsync(
                wethAddress,
                wethBalance.sub(newWethBalance),
                ethAccount,
                TX_DEFAULTS,
            );
        } else {
            return;
        }

        await web3Wrapper.awaitTransactionSuccessAsync(tx);
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
        dispatch(setEthBalance(ethBalance));

        const newWethTokenBalance = wethTokenBalance
            ? {
                  ...wethTokenBalance,
                  balance: newWethBalance,
              }
            : null;

        dispatch(setWethTokenBalance(newWethTokenBalance));
    };
};

export const setConnectedUser = (ethAccount: string, networkId: number) => {
    return async (dispatch: any) => {
        const knownTokens = getKnownTokens(networkId);

        dispatch(setEthAccount(ethAccount));

        const contractWrappers = await getContractWrappers();
        contractWrappers.exchange.subscribe(
            ExchangeEvents.Fill,
            { makerAddress: ethAccount },
            (err: Error | null, logEvent?: DecodedLogEvent<ExchangeFillEventArgs>) => {
                if (err || !logEvent) {
                    // tslint:disable-next-line:no-console
                    console.error('There was a problem with the ExchangeFill event', err, logEvent);
                    return;
                }
                const notification = buildOrderFilledNotification(logEvent.log.args, knownTokens);
                dispatch(addNotification(notification));
            },
        );
    };
};

export const initWallet = () => {
    return async (dispatch: any) => {
        dispatch(setWeb3State(Web3State.Loading));
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            if (web3Wrapper) {
                const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
                const networkId = await web3Wrapper.getNetworkIdAsync();

                const knownTokens = getKnownTokens(networkId);

                const tokenBalances = await Promise.all(
                    knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
                );

                const wethToken = knownTokens.getWethToken();
                const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);

                const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

                const selectedToken = knownTokens.getTokenBySymbol('ZRX');

                dispatch(setConnectedUser(ethAccount, networkId));
                dispatch(
                    initializeBlockchainData({
                        web3State: Web3State.Done,
                        ethBalance,
                        wethTokenBalance,
                        tokenBalances,
                    }),
                );
                dispatch(
                    initializeRelayerData({
                        orders: [],
                        userOrders: [],
                        selectedToken,
                    }),
                );
                dispatch(getOrderbookAndUserOrders());
            }
        } catch (error) {
            const knownTokens = getKnownTokens(MAINNET_ID);
            const selectedToken = knownTokens.getTokenBySymbol('ZRX');
            switch (error.message) {
                case METAMASK_USER_DENIED_AUTH: {
                    dispatch(setWeb3State(Web3State.Locked));
                    dispatch(
                        initializeRelayerData({
                            orders: [],
                            userOrders: [],
                            selectedToken,
                        }),
                    );
                    dispatch(getOrderBook());
                    break;
                }
                case METAMASK_NOT_INSTALLED: {
                    dispatch(setWeb3State(Web3State.NotInstalled));
                    dispatch(
                        initializeRelayerData({
                            orders: [],
                            userOrders: [],
                            selectedToken,
                        }),
                    );
                    dispatch(getOrderBook());
                    break;
                }
                default: {
                    dispatch(setWeb3State(Web3State.Error));
                    break;
                }
            }
        }
    };
};

export const connectWallet = () => {
    return async (dispatch: any) => {
        await reconnectWallet();
        dispatch(initWallet());
    };
};
