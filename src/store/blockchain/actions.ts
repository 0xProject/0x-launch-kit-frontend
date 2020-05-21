// tslint:disable:max-file-line-count
import { ERC20TokenContract, ERC721TokenContract } from '@0x/contract-wrappers';
import { signatureUtils } from '@0x/order-utils';
import { MetamaskSubprovider } from '@0x/subproviders';
import { BigNumber } from '@0x/utils';
import { createAction, createAsyncAction } from 'typesafe-actions';

import {
    COLLECTIBLE_ADDRESS,
    NETWORK_ID,
    START_BLOCK_LIMIT,
    UNLIMITED_ALLOWANCE_IN_BASE_UNITS,
    ZERO,
} from '../../common/constants';
import { ConvertBalanceMustNotBeEqualException } from '../../exceptions/convert_balance_must_not_be_equal_exception';
import { SignedOrderException } from '../../exceptions/signed_order_exception';
import { subscribeToFillEvents } from '../../services/exchange';
import { getGasEstimationInfoAsync } from '../../services/gas_price_estimation';
import { LocalStorage } from '../../services/local_storage';
import { tokensToTokenBalances, tokenToTokenBalance } from '../../services/tokens';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { buildOrderFilledNotification } from '../../util/notifications';
import { buildSellCollectibleOrder } from '../../util/orders';
import { getTransactionOptions } from '../../util/transactions';
import {
    BlockchainState,
    Collectible,
    GasInfo,
    MARKETPLACES,
    OrderSide,
    ThunkCreator,
    Token,
    TokenBalance,
    Web3State,
} from '../../util/types';
import { getAllCollectibles } from '../collectibles/actions';
import { fetchMarkets, setMarketTokens, updateMarketPriceEther } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import {
    getCurrencyPair,
    getCurrentMarketPlace,
    getEthAccount,
    getGasPriceInWei,
    getMarkets,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from '../selectors';
import { addNotifications, setHasUnreadNotifications, setNotifications } from '../ui/actions';

const logger = getLogger('Blockchain::Actions');

export const convertBalanceStateAsync = createAsyncAction(
    'blockchain/CONVERT_BALANCE_STATE_fetch_request',
    'blockchain/CONVERT_BALANCE_STATE_fetch_success',
    'blockchain/CONVERT_BALANCE_STATE_fetch_failure',
)<void, void, void>();

export const initializeBlockchainData = createAction('blockchain/init', resolve => {
    return (blockchainData: Partial<BlockchainState>) => resolve(blockchainData);
});

export const setEthAccount = createAction('blockchain/ETH_ACCOUNT_set', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction('blockchain/WEB3_STATE_set', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction('blockchain/TOKEN_BALANCES_set', resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setEthBalance = createAction('blockchain/ETH_BALANCE_set', resolve => {
    return (ethBalance: BigNumber) => resolve(ethBalance);
});

export const setWethBalance = createAction('blockchain/WETH_BALANCE_set', resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setWethTokenBalance = createAction('blockchain/WETH_TOKEN_BALANCE_set', resolve => {
    return (wethTokenBalance: TokenBalance | null) => resolve(wethTokenBalance);
});

export const setGasInfo = createAction('blockchain/GAS_INFO_set', resolve => {
    return (gasInfo: GasInfo) => resolve(gasInfo);
});

export const toggleTokenLock: ThunkCreator<Promise<any>> = (token: Token, isUnlocked: boolean) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const contractWrappers = await getContractWrappers();
        const web3Wrapper = await getWeb3Wrapper();

        const erc20Token = new ERC20TokenContract(token.address, contractWrappers.getProvider());
        const amount = isUnlocked ? ZERO : UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
        const tx = await erc20Token
            .approve(contractWrappers.contractAddresses.erc20Proxy, amount)
            .sendTransactionAsync({
                from: ethAccount,
                ...getTransactionOptions(gasPrice),
            });

        web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });

        return tx;
    };
};

export const updateTokenBalancesOnToggleTokenLock: ThunkCreator = (token: Token, isUnlocked: boolean) => {
    return async (dispatch, getState) => {
        const state = getState();

        if (isWeth(token.symbol)) {
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

export const updateWethBalance: ThunkCreator<Promise<any>> = (newWethBalance: BigNumber) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const contractWrappers = await getContractWrappers();
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const wethBalance = getWethBalance(state);

        let txHash: string;
        const wethToken = contractWrappers.weth9;
        if (wethBalance.isLessThan(newWethBalance)) {
            txHash = await wethToken.deposit().sendTransactionAsync({
                value: newWethBalance.minus(wethBalance),
                from: ethAccount,
                ...getTransactionOptions(gasPrice),
            });
        } else if (wethBalance.isGreaterThan(newWethBalance)) {
            txHash = await wethToken.withdraw(wethBalance.minus(newWethBalance)).sendTransactionAsync({
                from: ethAccount,
                ...getTransactionOptions(gasPrice),
            });
        } else {
            throw new ConvertBalanceMustNotBeEqualException(wethBalance, newWethBalance);
        }

        return txHash;
    };
};

export const updateTokenBalances: ThunkCreator<Promise<any>> = (txHash?: string) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const knownTokens = getKnownTokens();
        const wethToken = knownTokens.getWethToken();

        const allTokenBalances = await tokensToTokenBalances([...knownTokens.getTokens(), wethToken], ethAccount);
        const wethBalance = allTokenBalances.find(b => b.token.symbol === wethToken.symbol);
        const tokenBalances = allTokenBalances.filter(b => b.token.symbol !== wethToken.symbol);
        dispatch(setTokenBalances(tokenBalances));

        const web3Wrapper = await getWeb3Wrapper();
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
        if (wethBalance) {
            dispatch(setWethBalance(wethBalance.balance));
        }
        dispatch(setEthBalance(ethBalance));
        return ethBalance;
    };
};

export const updateGasInfo: ThunkCreator = () => {
    return async dispatch => {
        const fetchedGasInfo = await getGasEstimationInfoAsync();
        dispatch(setGasInfo(fetchedGasInfo));
    };
};

let fillEventsSubscription: string | null = null;
export const setConnectedUserNotifications: ThunkCreator<Promise<any>> = (ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const knownTokens = getKnownTokens();
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setEthAccount(ethAccount));

        dispatch(setNotifications(localStorage.getNotifications(ethAccount)));
        dispatch(setHasUnreadNotifications(localStorage.getHasUnreadNotifications(ethAccount)));

        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
        const contractWrappers = await getContractWrappers();

        const blockNumber = await web3Wrapper.getBlockNumberAsync();

        const lastBlockChecked = localStorage.getLastBlockChecked(ethAccount);

        const fromBlock =
            lastBlockChecked !== null ? lastBlockChecked + 1 : Math.max(blockNumber - START_BLOCK_LIMIT, 1);

        const toBlock = blockNumber;

        const markets = getMarkets(state);

        const subscription = subscribeToFillEvents({
            exchange: contractWrappers.exchange,
            fromBlock,
            toBlock,
            ethAccount,
            fillEventCallback: async fillEvent => {
                if (!knownTokens.isValidFillEvent(fillEvent)) {
                    return;
                }

                const timestamp = await web3Wrapper.getBlockTimestampAsync(fillEvent.blockNumber || blockNumber);
                const notification = buildOrderFilledNotification(fillEvent, knownTokens, markets);
                dispatch(
                    addNotifications([
                        {
                            ...notification,
                            timestamp: new Date(timestamp * 1000),
                        },
                    ]),
                );
            },
            pastFillEventsCallback: async fillEvents => {
                const validFillEvents = fillEvents.filter(knownTokens.isValidFillEvent);

                const notifications = await Promise.all(
                    validFillEvents.map(async fillEvent => {
                        const timestamp = await web3Wrapper.getBlockTimestampAsync(
                            fillEvent.blockNumber || blockNumber,
                        );
                        const notification = buildOrderFilledNotification(fillEvent, knownTokens, markets);

                        return {
                            ...notification,
                            timestamp: new Date(timestamp * 1000),
                        };
                    }),
                );

                dispatch(addNotifications(notifications));
            },
        });

        if (fillEventsSubscription) {
            contractWrappers.exchange.unsubscribe(fillEventsSubscription);
        }
        fillEventsSubscription = subscription;

        localStorage.saveLastBlockChecked(blockNumber, ethAccount);
    };
};

export const initWallet: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
        dispatch(setWeb3State(Web3State.Loading));
        const state = getState();
        const currentMarketPlace = getCurrentMarketPlace(state);

        try {
            await dispatch(initWalletBeginCommon());

            if (currentMarketPlace === MARKETPLACES.ERC20) {
                // tslint:disable-next-line:no-floating-promises
                dispatch(initWalletERC20());
            } else {
                // tslint:disable-next-line:no-floating-promises
                dispatch(initWalletERC721());
            }
        } catch (error) {
            // Web3Error
            logger.error('There was an error when initializing the wallet', error);
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};

const initWalletBeginCommon: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { initializeWeb3Wrapper }) => {
        const web3Wrapper = await initializeWeb3Wrapper();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const knownTokens = getKnownTokens();
            const wethToken = knownTokens.getWethToken();
            const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);
            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

            await dispatch(
                initializeBlockchainData({
                    ethAccount,
                    web3State: Web3State.Done,
                    ethBalance,
                    wethTokenBalance,
                    tokenBalances: [],
                }),
            );

            dispatch(
                initializeRelayerData({
                    orders: [],
                    userOrders: [],
                }),
            );
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateGasInfo());

            // tslint:disable-next-line:no-floating-promises
            dispatch(updateMarketPriceEther());

            const networkId = await web3Wrapper.getNetworkIdAsync();
            if (networkId !== NETWORK_ID) {
                dispatch(setWeb3State(Web3State.Error));
            }
        }
    };
};

const initWalletERC20: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        if (!web3Wrapper) {
            // tslint:disable-next-line:no-floating-promises
            dispatch(initializeAppNoMetamaskOrLocked());

            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderBook());
        } else {
            const state = getState();
            const knownTokens = getKnownTokens();
            const ethAccount = getEthAccount(state);
            const tokenBalances = await tokensToTokenBalances(knownTokens.getTokens(), ethAccount);

            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(setTokenBalances(tokenBalances));

            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());

            try {
                await dispatch(fetchMarkets());
                // For executing this method (setConnectedUserNotifications) is necessary that the setMarkets method is already dispatched, otherwise it wont work (redux-thunk problem), so it's need to be dispatched here
                // tslint:disable-next-line:no-floating-promises
                dispatch(setConnectedUserNotifications(ethAccount));
            } catch (error) {
                // Relayer error
                logger.error('The fetch markets from the relayer failed', error);
            }
        }
    };
};

const initWalletERC721: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        if (web3Wrapper) {
            const state = getState();
            const ethAccount = getEthAccount(state);
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles(ethAccount));
        } else {
            // tslint:disable-next-line:no-floating-promises
            dispatch(initializeAppNoMetamaskOrLocked());

            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        }
    };
};

export const unlockCollectible: ThunkCreator<Promise<string>> = (collectible: Collectible) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const state = getState();
        const contractWrappers = await getContractWrappers();
        const gasPrice = getGasPriceInWei(state);
        const ethAccount = getEthAccount(state);
        const erc721Token = new ERC721TokenContract(COLLECTIBLE_ADDRESS, contractWrappers.getProvider());

        const tx = await erc721Token
            .setApprovalForAll(contractWrappers.contractAddresses.erc721Proxy, true)
            .sendTransactionAsync({ from: ethAccount, ...getTransactionOptions(gasPrice) });
        return tx;
    };
};

export const unlockToken: ThunkCreator = (token: Token) => {
    return async dispatch => {
        return dispatch(toggleTokenLock(token, false));
    };
};

export const lockToken: ThunkCreator = (token: Token) => {
    return async dispatch => {
        return dispatch(toggleTokenLock(token, true));
    };
};

export const createSignedCollectibleOrder: ThunkCreator = (
    collectible: Collectible,
    side: OrderSide,
    startPrice: BigNumber,
    expirationDate: BigNumber,
    endPrice: BigNumber | null,
) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const collectibleId = new BigNumber(collectible.tokenId);
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const contractWrappers = await getContractWrappers();
            const wethAddress = getKnownTokens().getWethToken().address;
            const exchangeAddress = contractWrappers.exchange.address;
            let order;
            if (endPrice) {
                throw new Error('DutchAuction currently unsupported');
                // DutchAuction sell
                // const senderAddress = contractWrappers.dutchAuction.address;
                // order = await buildDutchAuctionCollectibleOrder({
                //     account: ethAccount,
                //     amount: new BigNumber('1'),
                //     price: startPrice,
                //     endPrice,
                //     expirationDate,
                //     wethAddress,
                //     collectibleAddress: COLLECTIBLE_ADDRESS,
                //     collectibleId,
                //     exchangeAddress,
                //     senderAddress,
                // });
            } else {
                // Normal Sell
                order = await buildSellCollectibleOrder(
                    {
                        account: ethAccount,
                        amount: new BigNumber('1'),
                        price: startPrice,
                        exchangeAddress,
                        expirationDate,
                        collectibleId,
                        collectibleAddress: COLLECTIBLE_ADDRESS,
                        wethAddress,
                    },
                    side,
                );
            }

            const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
            return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
        } catch (error) {
            throw new SignedOrderException(error.message);
        }
    };
};
/**
 *  Initializes the app with a default state if the user does not have metamask, with permissions rejected
 *  or if the user did not connected metamask to the dApp. Takes the info from the NETWORK_ID configured in the env vars
 */
export const initializeAppNoMetamaskOrLocked: ThunkCreator = () => {
    return async (dispatch, getState) => {
        if (isMetamaskInstalled()) {
            dispatch(setWeb3State(Web3State.Locked));
        } else {
            dispatch(setWeb3State(Web3State.NotInstalled));
        }
        const state = getState();
        const currencyPair = getCurrencyPair(state);
        const knownTokens = getKnownTokens();
        const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
        const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

        dispatch(
            initializeRelayerData({
                orders: [],
                userOrders: [],
            }),
        );

        // tslint:disable-next-line:no-floating-promises
        dispatch(setMarketTokens({ baseToken, quoteToken }));

        const currentMarketPlace = getCurrentMarketPlace(state);
        if (currentMarketPlace === MARKETPLACES.ERC20) {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderBook());

            // tslint:disable-next-line:no-floating-promises
            await dispatch(fetchMarkets());
        } else {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        }

        // tslint:disable-next-line:no-floating-promises
        dispatch(updateMarketPriceEther());
    };
};
