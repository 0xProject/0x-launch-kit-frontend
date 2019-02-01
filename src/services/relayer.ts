import { HttpClient } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';

let client: HttpClient | null = null;

export const getRelayer = (): HttpClient => {
    client = new HttpClient(RELAYER_URL);

    return client;
};
