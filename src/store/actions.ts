import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3Wrapper } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';

import { setEthBalance, setTokenBalances, setWethBalance } from './blockchain/actions';
import { getOrderbookAndUserOrders } from './relayer/actions';

export * from './blockchain/actions';
export * from './relayer/actions';
export * from './ui/actions';
export * from './market/actions';

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
