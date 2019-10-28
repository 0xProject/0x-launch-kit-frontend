import { NETWORK_ID } from '../common/constants';
import { Network } from '../util/types';

const ETHERSCAN_TRANSACTION_URL: { [key: number]: string } = {
    [Network.Mainnet]: 'https://etherscan.io/tx/',
    [Network.Ropsten]: 'https://ropsten.etherscan.io/tx/',
    [Network.Rinkeby]: 'https://rinkeby.etherscan.io/tx/',
    [Network.Kovan]: 'https://kovan.etherscan.io/tx/',
    [Network.Ganache]: 'https://etherscan.io/tx/',
};

export const ETHERSCAN_URL: { [key: number]: string } = {
    [Network.Mainnet]: 'https://etherscan.io/',
    [Network.Ropsten]: 'https://ropsten.etherscan.io/',
    [Network.Rinkeby]: 'https://rinkeby.etherscan.io/',
    [Network.Kovan]: 'https://kovan.etherscan.io/',
    [Network.Ganache]: 'https://etherscan.io/',
};

export const getTransactionLink = (hash: string): string => {
    return `${ETHERSCAN_TRANSACTION_URL[NETWORK_ID]}${hash}`;
};

export const viewAddressOnEtherscan = (ethAccount: string) => {
    window.open(`${ETHERSCAN_URL[NETWORK_ID]}address/${ethAccount}`);
};

export const getAddressLinkExplorer = (ethAccount: string): string => {
    return `${ETHERSCAN_URL[NETWORK_ID]}address/${ethAccount}`;
};
