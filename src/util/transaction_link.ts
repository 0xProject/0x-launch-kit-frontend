import { NETWORK_ID } from '../common/constants';
import { Network } from '../util/types';

const ETHERSCAN_TRANSACTION_URL: { [key: number]: string } = {
    [Network.Mainnet]: 'https://etherscan.io/tx/',
    [Network.Rinkeby]: 'https://rinkeby.etherscan.io/tx/',
    [Network.Kovan]: 'https://kovan.etherscan.io/tx/',
    [Network.Ganache]: 'https://etherscan.io/tx/',
};

export const getTransactionLink = (hash: string): string => {
    return `${ETHERSCAN_TRANSACTION_URL[NETWORK_ID]}${hash}`;
};
