import { NETWORK_ID } from '../../common/constants';
import { Network } from '../types';

const TOKENIZED_REGISTRY_ADDRESS: { [key: number]: string } = {
    [Network.Mainnet]: '0xD8dc30d298CCf40042991cB4B96A540d8aFFE73a',
    [Network.Ropsten]: '0xd03eea21041a19672e451bcbb413ce8be72d0381',
    [Network.Kovan]: '0xF1C87dD61BF8a4e21978487e2705D52AA687F97E',
};

const TOKEN_DATA_ADDRESS: { [key: number]: string } = {
    [Network.Ropsten]: '0xbb2626199c3a71ed15aead2ee1ad90f6c0759077',
};

export const getTokenizedRegistryAddress = (): string => {
    return `${TOKENIZED_REGISTRY_ADDRESS[NETWORK_ID].toLowerCase()}`;
};

export const getTokenDataAddress = (): string => {
    return `${TOKEN_DATA_ADDRESS[NETWORK_ID].toLowerCase()}`;
};
