import { ERC20_APP_BASE_PATH, MAINNET_ID } from '../common/constants';
import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3Wrapper } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';

import { setEthBalance, setTokenBalances, setWethBalance, updateGasInfo } from './blockchain/actions';
import { getAllCollectibles } from './collectibles/actions';
import { fetchMarkets, setMarketTokens } from './market/actions';
import { getOrderBook, getOrderbookAndUserOrders } from './relayer/actions';
import { getCurrencyPair, getCurrentRoutePath } from './selectors';

export * from './blockchain/actions';
export * from './market/actions';
export * from './relayer/actions';
export * from './router/actions';
export * from './ui/actions';
export * from './market/actions';
export * from './collectibles/actions';

export const updateStore = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
        const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const knownTokens = getKnownTokens(networkId);
        const wethToken = knownTokens.getWethToken();
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
        const wethBalance = await getTokenBalance(wethToken, ethAccount);
        // Generals update for both apps
        dispatch(setEthBalance(ethBalance));
        dispatch(setWethBalance(wethBalance));
        dispatch(updateGasInfo());
        // Updates based on the current app
        const currentRoute = getCurrentRoutePath(state);
        currentRoute.includes(ERC20_APP_BASE_PATH)
            ? dispatch(updateERC20Store(ethAccount, networkId))
            : dispatch(updateERC721Store(ethAccount));
    };
};

export const updateERC721Store = (ethAccount: string) => {
    return async (dispatch: any) => {
        dispatch(getAllCollectibles(ethAccount));
    };
};

export const updateERC20Store = (ethAccount: string, networkId: number) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        try {
            const knownTokens = getKnownTokens(networkId);
            const tokenBalances = await Promise.all(
                knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
            );
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderbookAndUserOrders());
            dispatch(setTokenBalances(tokenBalances));
            await dispatch(fetchMarkets());
        } catch (error) {
            const knownTokens = getKnownTokens(MAINNET_ID);
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);
            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderBook());
            dispatch(updateGasInfo());
        }
    };
};
