import { ZeroExProvider } from '@0x/order-utils';
import * as Bowser from 'bowser';

import { PROVIDER_TYPE_TO_NAME } from '../common/constants';

import { ProviderType } from './types';

const browser = Bowser.getParser(window.navigator.userAgent);

export const envUtil = {
    getBrowser(): string {
        return browser.getBrowserName().toLowerCase();
    },
    isMobileOperatingSystem(): boolean {
        return browser.getPlatformType(true) === 'mobile';
    },
    getOperatingSystem(): string {
        return browser.getOSName(true);
    },
    getProviderType(provider: ZeroExProvider): ProviderType | undefined {
        const anyProvider = provider as any;
        if (provider.constructor.name === 'EthereumProvider') {
            return ProviderType.Mist;
        } else if ((window as any).ethereum !== undefined && (window as any).ethereum.isTrust) {
            return ProviderType.TrustWallet;
        } else if (anyProvider.isParity) {
            return ProviderType.Parity;
        } else if (anyProvider.isMetaMask) {
            return ProviderType.MetaMask;
        } else if ((window as any).SOFA !== undefined) {
            return ProviderType.CoinbaseWallet;
        } else if ((window as any).enjin !== undefined) {
            return ProviderType.EnjinWallet;
        } else if ((window as any).__CIPHER__ !== undefined) {
            return ProviderType.Cipher;
        } else if (envUtil.getBrowser() === 'opera' && !anyProvider.isMetaMask) {
            return ProviderType.Opera;
        }
        return;
    },
    getProviderTypeFromWindow(): ProviderType | undefined {
        if ((window as any).SOFA !== undefined) {
            return ProviderType.CoinbaseWallet;
        } else if ((window as any).enjin !== undefined) {
            return ProviderType.EnjinWallet;
        } else if ((window as any).__CIPHER__ !== undefined) {
            return ProviderType.Cipher;
        }
        return;
    },
    getProviderName(provider: ZeroExProvider): string {
        const providerTypeIfExists = envUtil.getProviderType(provider);
        if (providerTypeIfExists === undefined) {
            return provider.constructor.name;
        }
        return PROVIDER_TYPE_TO_NAME[providerTypeIfExists];
    },
    getProviderDisplayName(provider: ZeroExProvider): string {
        const providerTypeIfExists = envUtil.getProviderType(provider);
        if (providerTypeIfExists === undefined) {
            return 'Wallet';
        }
        return PROVIDER_TYPE_TO_NAME[providerTypeIfExists];
    },
};
