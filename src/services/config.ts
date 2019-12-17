import { RELAYER_URL } from '../common/constants';
import { ConfigRelayerData } from '../util/types';

export const getConfigFromNameOrDomain = async ({
    name,
    domain,
}: {
    name?: string;
    domain?: string;
}): Promise<ConfigRelayerData | undefined> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    let response;
    if (domain) {
        response = await fetch(`${RELAYER_URL}/config?domain=${domain}`, init);
    }
    if (name) {
        response = await fetch(`${RELAYER_URL}/config?name=${name}`, init);
    }
    if (!response) {
        return undefined;
    }
    if (response.ok) {
        return (await response.json()) as ConfigRelayerData;
    } else {
        return undefined;
    }
};

export const postConfig = async (config: ConfigRelayerData): Promise<ConfigRelayerData | undefined> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(config),
    };
    const response = await fetch(`${RELAYER_URL}/config`, init);
    if (response.ok) {
        return (await response.json()) as ConfigRelayerData;
    } else {
        return undefined;
    }
};
