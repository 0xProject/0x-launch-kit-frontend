import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { createAction } from 'typesafe-actions';

import {
    ETH_MARKET_PRICE_API_ENDPOINT,
    FETCH_PRICE_TIME_TO_STALE,
    TX_DEFAULTS,
    ZEROX_MARKET_PRICE_API_ENDPOINT,
} from '../common/constants';
import { getContractWrappers } from '../services/contract_wrappers';
import { cancelSignedOrder, getAllOrdersAsUIOrders, getUserOrdersAsUIOrders } from '../services/orders';
import { getRelayer } from '../services/relayer';
import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3Wrapper, getWeb3WrapperOrThrow } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';
import { buildLimitOrder, buildMarketOrders } from '../util/orders';
import {
    BlockchainState,
    FetchPrice,
    OrderSide,
    Price,
    RelayerState,
    Step,
    StepKind,
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

// Price ZeroX Actions
export const fetchPriceZRXAbort = createAction('FETCH_PRICE_ZRX_ABORT');

export const fetchPriceZRXError = createAction('FETCH_PRICE_ZRX_ERROR', resolve => {
    return (data: any) => resolve(data);
});

export const fetchPriceZRXStart = createAction('FETCH_PRICE_ZRX_START');

export const fetchPriceZRXUpdate = createAction('FETCH_PRICE_ZRX_UPDATE', resolve => {
    return (data: FetchPrice) => resolve(data);
});

// Price ethereum actions
export const fetchPriceEthereumAbort = createAction('FETCH_PRICE_ETHEREUM_ABORT');

export const fetchPriceEthereumError = createAction('FETCH_PRICE_ETHEREUM_ERROR', resolve => {
    return (data: any) => resolve(data);
});

export const fetchPriceEthereumStart = createAction('FETCH_PRICE_ETHEREUM_START');

export const fetchPriceEthereumUpdate = createAction('FETCH_PRICE_ETHEREUM_UPDATE', resolve => {
    return (data: FetchPrice) => resolve(data);
});

export const unlockToken = (token: Token) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const tokenBalances = getTokenBalances(state);

        const contractWrappers = await getContractWrappers();
        await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);

        const updatedTokenBalances = tokenBalances.map(tokenBalance => {
            if (tokenBalance.token.address !== token.address) {
                return tokenBalance;
            }

            return {
                ...tokenBalance,
                isUnlocked: true,
            };
        });

        dispatch(setTokenBalances(updatedTokenBalances));
    };
};

export const lockToken = (token: Token) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const tokenBalances = getTokenBalances(state);

        const contractWrappers = await getContractWrappers();

        await contractWrappers.erc20Token.setProxyAllowanceAsync(
            token.address,
            ethAccount,
            new BigNumber('0'),
            TX_DEFAULTS,
        );

        const updatedTokenBalances = tokenBalances.map(tokenBalance => {
            if (tokenBalance.token.address !== token.address) {
                return tokenBalance;
            }
            return {
                ...tokenBalance,
                isUnlocked: false,
            };
        });

        dispatch(setTokenBalances(updatedTokenBalances));
    };
};

export const updateWethBalance = (newWethBalance: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
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
        dispatch(setWethBalance(newWethBalance));
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

            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            const selectedToken = knownTokens.getTokenBySymbol('ZRX');

            dispatch(
                initializeBlockchainData({
                    web3State: Web3State.Done,
                    ethAccount,
                    ethBalance,
                    wethBalance,
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
            dispatch(getAllOrders());
            dispatch(getUserOrders());
            dispatch(updateFetchPrice(Price.Ether));
            dispatch(updateFetchPrice(Price.Zrx));
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

        dispatch(setUserOrders(myUIOrders));
    };
};

export const cancelOrder = (order: SignedOrder) => {
    return async (dispatch: any) => {
        await cancelSignedOrder(order);

        dispatch(getAllOrders());
        dispatch(getUserOrders());
    };
};

export const startBuySellLimitSteps = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any) => {
        const step: Step = {
            kind: StepKind.BuySellLimit,
            amount,
            price,
            side,
        };
        const pendingSteps: Step[] = [];
        dispatch(setStepsModalPendingSteps(pendingSteps));
        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalDoneSteps([]));
    };
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
        dispatch(getAllOrders());
        dispatch(getUserOrders());
        return submitResult;
    };
};

export const submitMarketOrder = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);

        const contractWrappers = await getContractWrappers();

        const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);

        const [ordersToFill, amounts, canBeFilled] = buildMarketOrders(
            {
                amount,
                orders,
            },
            side,
        );

        if (canBeFilled) {
            await contractWrappers.exchange.batchFillOrdersAsync(ordersToFill, amounts, ethAccount, TX_DEFAULTS);
            dispatch(getAllOrders());
            dispatch(getUserOrders());
        } else {
            window.alert('There are no enough orders to fill this amount');
        }
    };
};

export const updateFetchPrice = (typePrice: Price) => {
    return async (dispatch: any, getState: any) => {
        let timeSinceLastFetch = 0;
        let fetchPriceStart = null;
        let fetchPriceUpdate = null;
        let fetchPriceError = null;
        let fetchPriceAbort = null;
        let apiEndpoint = null;

        if (typePrice === Price.Ether) {
            timeSinceLastFetch = getState().priceZRX.lastFetched;
            fetchPriceStart = fetchPriceEthereumStart;
            fetchPriceUpdate = fetchPriceEthereumUpdate;
            fetchPriceError = fetchPriceEthereumError;
            fetchPriceAbort = fetchPriceEthereumAbort;
            apiEndpoint = ETH_MARKET_PRICE_API_ENDPOINT;
        } else if (typePrice === Price.Zrx) {
            timeSinceLastFetch = getState().priceEther.lastFetched;
            fetchPriceStart = fetchPriceZRXStart;
            fetchPriceUpdate = fetchPriceZRXUpdate;
            fetchPriceError = fetchPriceZRXError;
            fetchPriceAbort = fetchPriceZRXAbort;
            apiEndpoint = ZEROX_MARKET_PRICE_API_ENDPOINT;
        } else {
            throw new Error('Missing price type');
        }

        const isDataStale = Date.now() - timeSinceLastFetch > FETCH_PRICE_TIME_TO_STALE;
        if (isDataStale) {
            dispatch(fetchPriceStart());

            // Run the async fetch
            try {
                const data = await fetch(apiEndpoint);
                if (data.status !== 200) {
                    throw new Error('Failed to fetch prices');
                }
                const content = await data.json();
                const priceUsd: string = (content as any)[0].price_usd;
                dispatch(
                    fetchPriceUpdate({
                        price: new BigNumber(priceUsd),
                        error: null,
                        isFetching: false,
                        lastFetched: Date.now(),
                    }),
                );
            } catch (err) {
                dispatch(fetchPriceError(err));
            }
        } else {
            dispatch(fetchPriceAbort());
        }
    };
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

            dispatch(getAllOrders());
            dispatch(getUserOrders());
            dispatch(setTokenBalances(tokenBalances));
            dispatch(setEthBalance(ethBalance));
            dispatch(setWethBalance(wethBalance));
            dispatch(updateFetchPrice(Price.Zrx));
            dispatch(updateFetchPrice(Price.Ether));
        }
    };
};
