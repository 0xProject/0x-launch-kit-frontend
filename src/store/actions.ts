import { MAINNET_ID } from '../common/constants';
import { getTokenBalance, tokenToTokenBalance } from '../services/tokens';
import { getWeb3WrapperOrThrow } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';

import { setEthBalance, setTokenBalances, setWethBalance } from './blockchain/actions';
import { getOrderBook, getOrderbookAndUserOrders, setSelectedToken } from './relayer/actions';

export * from './blockchain/actions';
export * from './relayer/actions';
export * from './ui/actions';

export const updateStore = () => {
    return async (dispatch: any) => {
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

            dispatch(getOrderbookAndUserOrders());
            dispatch(setTokenBalances(tokenBalances));
            dispatch(setEthBalance(ethBalance));
            dispatch(setWethBalance(wethBalance));
        } catch (error) {
            const knownTokens = getKnownTokens(MAINNET_ID);
            const selectedToken = knownTokens.getTokenBySymbol('ZRX');
            dispatch(setSelectedToken(selectedToken));
            dispatch(getOrderBook());
        }
    };
};
