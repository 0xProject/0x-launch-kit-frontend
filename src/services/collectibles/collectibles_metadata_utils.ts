import { SERVICE_GATEWAY_ERC721 } from '../../common/constants';
import { Gateway } from '../../util/types';

import { OpenSea } from './gateways/open_sea';

const gateways: Gateway = {
    open_sea: new OpenSea(),
};

export const loadGateway = () => {
    const gateway = SERVICE_GATEWAY_ERC721.toLowerCase();
    return gateways[gateway];
};
