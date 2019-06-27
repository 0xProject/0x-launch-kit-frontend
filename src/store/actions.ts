import { getWeb3Wrapper } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';
import { MARKETPLACES } from '../util/types';

import { updateGasInfo, updateTokenBalances } from './blockchain/actions';
import { getAllCollectibles } from './collectibles/actions';
import { fetchMarkets, setMarketTokens, updateMarketPriceEther, updateMarketPriceQuote } from './market/actions';
import { getOrderBook, getOrderbookAndUserOrders } from './relayer/actions';
import { getCurrencyPair, getCurrentMarketPlace } from './selectors';

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
        dispatch(updateTokenBalances());
        dispatch(updateGasInfo());
        dispatch(updateMarketPriceEther());

        // Updates based on the current app
        const currentMarketPlace = getCurrentMarketPlace(state);
        if (currentMarketPlace === MARKETPLACES.ERC20) {
            dispatch(updateERC20Store(ethAccount));
            dispatch(updateMarketPriceQuote());
        } else {
            dispatch(updateERC721Store(ethAccount));
        }
    };
};

export const updateERC721Store = (ethAccount: string) => {
    return async (dispatch: any) => {
        dispatch(getAllCollectibles(ethAccount));
    };
};

export const updateERC20Store = (ethAccount: string) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        try {
            const knownTokens = getKnownTokens();
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderbookAndUserOrders());
            await dispatch(fetchMarkets());
        } catch (error) {
            const knownTokens = getKnownTokens();
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderBook());
        }
    };
};
