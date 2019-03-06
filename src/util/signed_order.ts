import { BigNumber, MetamaskSubprovider, signatureUtils, SignedOrder } from '0x.js';

import { getContractWrappers } from '../services/contract_wrappers';
import { getWeb3WrapperOrThrow } from '../services/web3_wrapper';

import { getKnownTokens } from './known_tokens';
import { buildLimitOrder } from './orders';
import { OrderSide, Token } from './types';

const createSignedOrder = async (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
    ethAccount: string,
    selectedToken: Token,
): Promise<SignedOrder> => {
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

export { createSignedOrder };
