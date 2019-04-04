import { MAINNET_ID } from '../common/constants';
import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3WrapperOrThrow } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';

import { setEthBalance, setTokenBalances, setWethBalance, updateGasInfo } from './blockchain/actions';
import { fetchMarkets, setMarketTokens } from './market/actions';
import { getOrderBook, getOrderbookAndUserOrders } from './relayer/actions';
import { getCurrencyPair } from './selectors';

export * from './blockchain/actions';
export * from './market/actions';
export * from './relayer/actions';
export * from './router/actions';
export * from './ui/actions';
export * from './market/actions';

export const updateStore = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();

            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const tokenBalances = await Promise.all(
                knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
            );
            const wethToken = knownTokens.getWethToken();
            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderbookAndUserOrders());
            dispatch(setTokenBalances(tokenBalances));
            dispatch(setEthBalance(ethBalance));
            dispatch(setWethBalance(wethBalance));
            await dispatch(fetchMarkets());
            dispatch(updateGasInfo());
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
