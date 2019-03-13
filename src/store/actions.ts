import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { createAction } from 'typesafe-actions';

import { TX_DEFAULTS, WETH_TOKEN_SYMBOL, ZRX_TOKEN_SYMBOL } from '../common/constants';
import { getContractWrappers } from '../services/contract_wrappers';
import { cancelSignedOrder, getAllOrdersAsUIOrders, getUserOrdersAsUIOrders } from '../services/orders';
import { getRelayer } from '../services/relayer';
import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3Wrapper, getWeb3WrapperOrThrow } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';
import { buildLimitOrder, buildMarketOrders } from '../util/orders';
import { unitsInTokenAmount } from '../util/tokens';
import {
    BlockchainState,
    OrderSide,
    RelayerState,
    Step,
    StepKind,
    StepUnlockToken,
    StepWrapEth,
    StoreState,
    Token,
    TokenBalance,
    UIOrder,
    Web3State,
} from '../util/types';

import {
    getEthAccount,
    getOpenBuyOrders,
    getOpenSellOrders,
    getSelectedToken,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from './selectors';

export const initializeBlockchainData = createAction('INITIALIZE_BLOCKCHAIN_DATA', resolve => {
    return (blockchainData: BlockchainState) => resolve(blockchainData);
});

export const initializeRelayerData = createAction('INITIALIZE_RELAYER_DATA', resolve => {
    return (relayerData: RelayerState) => resolve(relayerData);
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

export const setOrders = createAction('SET_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction('SET_USER_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setSelectedToken = createAction('SET_SELECTED_TOKEN', resolve => {
    return (selectedToken: Token | null) => resolve(selectedToken);
});

export const setStepsModalPendingSteps = createAction('SET_STEPSMODAL_PENDING_STEPS', resolve => {
    return (pendingSteps: Step[]) => resolve(pendingSteps);
});

export const setStepsModalDoneSteps = createAction('SET_STEPSMODAL_DONE_STEPS', resolve => {
    return (doneSteps: Step[]) => resolve(doneSteps);
});

export const setStepsModalCurrentStep = createAction('SET_STEPSMODAL_CURRENT_STEP', resolve => {
    return (currentStep: Step | null) => resolve(currentStep);
});

export const stepsModalAdvanceStep = createAction('STEPSMODAL_ADVANCE_STEP');

export const stepsModalReset = createAction('STEPSMODAL_RESET');

export const unlockToken = (token: Token) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        const state = getState();

        let tokenBalance: TokenBalance;
        if (token.symbol === WETH_TOKEN_SYMBOL) {
            tokenBalance = getWethTokenBalance(state) as TokenBalance;
        } else {
            tokenBalance = getTokenBalances(state).find(
                balance => balance.token.address === token.address,
            ) as TokenBalance;
        }

        if (!tokenBalance.isUnlocked) {
            const ethAccount = getEthAccount(state);
            const contractWrappers = await getContractWrappers();
            return contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);
        } else {
            return Promise.resolve();
        }
    };
};

export const unlockTokenAndUpdateTokenBalance = (token: Token) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        const txHash = await dispatch(unlockToken(token));

        const web3Wrapper = await getWeb3WrapperOrThrow();
        await web3Wrapper.awaitTransactionSuccessAsync(txHash);

        const state = getState();
        const tokenBalance = getTokenBalances(state).find(
            balance => balance.token.address === token.address,
        ) as TokenBalance;
        const updatedTokenBalance = {
            ...tokenBalance,
            isUnlocked: true,
        };
        dispatch(updateTokenBalance(updatedTokenBalance));
    };
};

export const updateTokenBalance = (updatedTokenBalance: TokenBalance) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const updatedTokenBalances = getTokenBalances(state).map(tokenBalance => {
            if (tokenBalance.token.address !== updatedTokenBalance.token.address) {
                return tokenBalance;
            } else {
                return updatedTokenBalance;
            }
        });
        dispatch(setTokenBalances(updatedTokenBalances));
    };
};

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

export const addWethToBalance = (amount: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const wethToken = getKnownTokens().getWethToken();
        const wethAmount = unitsInTokenAmount(amount.toString(), wethToken.decimals);

        const state = getState();
        const ethAccount = getEthAccount(state);
        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const wethAddress = getKnownTokens(networkId).getWethToken().address;

        const contractWrappers = await getContractWrappers();
        const tx = await contractWrappers.etherToken.depositAsync(wethAddress, wethAmount, ethAccount);
        return web3Wrapper.awaitTransactionSuccessAsync(tx);
    };
};

export const initWallet = () => {
    return async (dispatch: any) => {
        dispatch(setWeb3State(Web3State.Loading));

        const web3Wrapper = await getWeb3Wrapper();

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

            const selectedToken = knownTokens.getTokenBySymbol(ZRX_TOKEN_SYMBOL);

            dispatch(
                initializeBlockchainData({
                    web3State: Web3State.Done,
                    ethAccount,
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
        } else {
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};

export const getAllOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;
        const uiOrders = await getAllOrdersAsUIOrders(selectedToken);

        dispatch(setOrders(uiOrders));
    };
};

export const getUserOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;
        const ethAccount = getEthAccount(state);
        const myUIOrders = await getUserOrdersAsUIOrders(selectedToken, ethAccount);

        return dispatch(setUserOrders(myUIOrders));
    };
};

export const cancelOrder = (order: SignedOrder) => {
    return async (dispatch: any) => {
        await cancelSignedOrder(order);

        dispatch(getOrderbookAndUserOrders());
    };
};

export const startBuySellLimitSteps = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        const buySellLimitFlow: Step[] = [];

        const wrapEthStep = getWrapEthStepIfNeeded(price, side, state);
        if (wrapEthStep) {
            buySellLimitFlow.push(wrapEthStep);
        }
        const unlockZrxStep = getUnlockZrxStepIfNeeded(state);
        if (unlockZrxStep) {
            buySellLimitFlow.push(unlockZrxStep);
        }
        const unlockSelectedTokenStep = getUnlockSelectedTokenStepIfNeeded(side, state);
        if (unlockSelectedTokenStep) {
            buySellLimitFlow.push(unlockSelectedTokenStep);
        }

        buySellLimitFlow.push({
            kind: StepKind.BuySellLimit,
            amount,
            price,
            side,
        });

        dispatch(setStepsModalCurrentStep(buySellLimitFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellLimitFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startBuySellMarketSteps = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        const [, , canBeFilled] = getMarketOrdersToFillFromState(amount, side, state);
        if (!canBeFilled) {
            window.alert('There are no enough orders to fill this amount');
            return;
        }

        const buySellMarketFlow: Step[] = [];

        const unlockZrxStep = getUnlockZrxStepIfNeeded(state);
        if (unlockZrxStep) {
            buySellMarketFlow.push(unlockZrxStep);
        }
        const unlockSelectedTokenStep = getUnlockSelectedTokenStepIfNeeded(side, state);
        if (unlockSelectedTokenStep) {
            buySellMarketFlow.push(unlockSelectedTokenStep);
        }

        const selectedToken = getSelectedToken(state) as Token;
        buySellMarketFlow.push({
            kind: StepKind.BuySellMarket,
            amount,
            side,
            token: selectedToken,
        });

        dispatch(setStepsModalCurrentStep(buySellMarketFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellMarketFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

const getWrapEthStepIfNeeded = (wethAmount: BigNumber, side: OrderSide, state: StoreState): StepWrapEth | null => {
    // Weth needed only when creating a buy order
    if (side === OrderSide.Sell) {
        return null;
    }
    const wethTokenDecimals = getKnownTokens().getWethToken().decimals;
    const wethAmountInUnits = unitsInTokenAmount(wethAmount.toString(), wethTokenDecimals);
    const wethBalance = getWethBalance(state);

    // Need to wrap eth only if weth balance is not enough
    const deltaWeth = wethBalance.sub(wethAmountInUnits);
    if (deltaWeth.lessThan(0)) {
        return {
            kind: StepKind.WrapEth,
            amount: deltaWeth.abs().div(new BigNumber(10).pow(wethTokenDecimals)),
        };
    } else {
        return null;
    }
};

const getUnlockZrxStepIfNeeded = (state: StoreState): StepUnlockToken | null => {
    const tokenBalances = getTokenBalances(state);
    const zrxTokenBalance: TokenBalance = tokenBalances.find(
        tokenBalance => tokenBalance.token.symbol === ZRX_TOKEN_SYMBOL,
    ) as TokenBalance;
    if (zrxTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.UnlockToken,
            token: zrxTokenBalance.token,
        };
    }
};

const getUnlockSelectedTokenStepIfNeeded = (side: OrderSide, state: StoreState): StepUnlockToken | null => {
    const tokenBalances = getTokenBalances(state);
    let selectedTokenBalance: TokenBalance;
    if (side === OrderSide.Sell) {
        const selectedToken = getSelectedToken(state) as Token;
        selectedTokenBalance = tokenBalances.find(
            tokenBalance => tokenBalance.token.symbol === selectedToken.symbol,
        ) as TokenBalance;
    } else {
        selectedTokenBalance = getWethTokenBalance(state) as TokenBalance;
    }

    if (selectedTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.UnlockToken,
            token: selectedTokenBalance.token,
        };
    }
};

export const createSignedOrder = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const selectedToken = getSelectedToken(state) as Token;

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const contractWrappers = await getContractWrappers();
        const wethAddress = getKnownTokens(networkId).getWethToken().address;

        const order = buildLimitOrder(
            {
                account: ethAccount,
                amount,
                price,
                tokenAddress: selectedToken.address,
                wethAddress,
                exchangeAddress: contractWrappers.exchange.address,
            },
            side,
        );

        const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
        return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
    };
};

export const submitLimitOrder = (signedOrder: SignedOrder) => {
    return async (dispatch: any) => {
        const submitResult = await getRelayer().client.submitOrderAsync(signedOrder);
        dispatch(getOrderbookAndUserOrders());
        return submitResult;
    };
};

export const submitMarketOrder = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const [ordersToFill, amounts, canBeFilled] = getMarketOrdersToFillFromState(amount, side, state);
        if (canBeFilled) {
            const ethAccount = getEthAccount(state);
            return fillOrders(ordersToFill, amounts, ethAccount);
        } else {
            window.alert('There are no enough orders to fill this amount');
            return Promise.reject();
        }
    };
};

const getMarketOrdersToFillFromState = (amount: BigNumber, side: OrderSide, state: StoreState) => {
    const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
    return buildMarketOrders(
        {
            amount,
            orders,
        },
        side,
    );
};

const fillOrders = async (ordersToFill: SignedOrder[], amounts: BigNumber[], ethAccount: string) => {
    const contractWrappers = await getContractWrappers();
    return contractWrappers.exchange.batchFillOrdersAsync(ordersToFill, amounts, ethAccount, TX_DEFAULTS);
};

export const updateStore = () => {
    return async (dispatch: any) => {
        const web3Wrapper = await getWeb3Wrapper();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const tokenBalances = await Promise.all(
                knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
            );
            const wethToken = knownTokens.getWethToken();
            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            dispatch(getOrderbookAndUserOrders());
            dispatch(setTokenBalances(tokenBalances));
            dispatch(setEthBalance(ethBalance));
            dispatch(setWethBalance(wethBalance));
        }
    };
};

export const getOrderbookAndUserOrders = () => {
    return async (dispatch: any) => {
        dispatch(getAllOrders());
        dispatch(getUserOrders());
    };
};
