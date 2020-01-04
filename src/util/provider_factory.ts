import { ZeroExProvider } from '@0x/order-utils';
import { providerUtils } from '@0x/utils';

import { Maybe } from './types';

export const providerFactory = {
    getInjectedProviderIfExists: (): Maybe<ZeroExProvider> => {
        const injectedProviderIfExists = (window as any).ethereum;
        if (injectedProviderIfExists !== undefined) {
            const provider = providerUtils.standardizeOrThrow(injectedProviderIfExists);
            return provider;
        }
        const injectedWeb3IfExists = (window as any).web3;
        if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
            const currentProvider = injectedWeb3IfExists.currentProvider;
            const provider = providerUtils.standardizeOrThrow(currentProvider);
            return provider;
        }

        const injectedEnjinProviderIfExists = (window as any).enjin;
        if (injectedEnjinProviderIfExists !== undefined) {
            const currentProvider = injectedEnjinProviderIfExists;
            const provider = providerUtils.standardizeOrThrow(currentProvider);
            return provider;
        }

        return undefined;
    },
};
