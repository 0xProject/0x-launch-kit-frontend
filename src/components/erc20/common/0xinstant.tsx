import { SignedOrder } from '0x.js';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FEE_RECIPIENT, INSTANT_FEE_PERCENTAGE, RELAYER_URL } from '../../../common/constants';
import { getUserIEOSignedOrders } from '../../../services/relayer';
import { getKnownTokens } from '../../../util/known_tokens';
import { Token, TokenIEO, Wallet } from '../../../util/types';

/**
 * @see https://cleverbeagle.com/blog/articles/tutorial-how-to-load-third-party-scripts-dynamically-in-javascript
 */
const load0xInstantScript = (callback: any) => {
    const existingScript = document.getElementById('zerox');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://instant.0x.org/instant.js';
        script.id = 'zerox';
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) {
                callback();
            }
        };
    }

    if (existingScript && callback) {
        callback();
    }
};

interface Props {
    provider?: string;
    walletDisplayName?: Wallet | null;
    availableAssetDatas?: any;
    defaultSelectedAssetData?: any;
    defaultAssetBuyAmount?: any;
    additionalAssetMetaDataMap?: any;
    networkId?: number;
    affiliateInfo?: any;
    feePercentage?: number;
    isIEO?: boolean;
}

declare var zeroExInstant: any;

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const ZeroXInstantComponent = (props: Props) => {
    const [isScriptReady, setScripReady] = useState(false);
    const query = useQuery();
    useEffect(() => {
        load0xInstantScript(() => {
            setScripReady(true);
        });
    }, []);

    const { networkId = 1 } = props;
    let feePercentage = INSTANT_FEE_PERCENTAGE;
    let orderSource: string | SignedOrder[] = RELAYER_URL;

    const openZeroXinstantModal = async () => {
        let token: Token | undefined;
        const tokenName = query.get('token');
        const tokenSymbol = query.get('symbol');
        const isEIO = query.get('isEIO');
        try {
            const knownTokens = getKnownTokens();
            if (tokenName) {
                token = knownTokens.getTokenByName(tokenName);
            }
            if (tokenSymbol) {
                token = knownTokens.getTokenBySymbol(tokenSymbol);
            }
            if (isEIO && token) {
                const baseToken = token as TokenIEO;
                const wethToken = knownTokens.getWethToken();
                orderSource = await getUserIEOSignedOrders(baseToken.owners[0].toLowerCase(), baseToken, wethToken);
                if (!orderSource || orderSource.length === 0) {
                    orderSource = RELAYER_URL;
                }
                feePercentage = Number(baseToken.feePercentage);
            }
        } catch {
            token = undefined;
        }
        let additionalAssetMetaDataMap = {};
        let erc20TokenAssetData;
        if (token) {
            erc20TokenAssetData = zeroExInstant.assetDataForERC20TokenAddress(token.address) as string;
            additionalAssetMetaDataMap = {
                [erc20TokenAssetData]: {
                    assetProxyId: zeroExInstant.ERC20_PROXY_ID,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    name: token.name,
                    primaryColor: token.primaryColor,
                    iconUrl: token.icon,
                },
            };
        }

        zeroExInstant.render(
            {
                //  provider: (await getWeb3Wrapper()).getProvider(),
                orderSource,
                networkId,
                affiliateInfo: {
                    feeRecipient: FEE_RECIPIENT,
                    feePercentage,
                },
                additionalAssetMetaDataMap,
                defaultSelectedAssetData: erc20TokenAssetData,
            },
            'body',
        );
    };
    if (isScriptReady) {
        // tslint:disable-next-line: no-floating-promises
        openZeroXinstantModal();
    }
    return <></>;
};
