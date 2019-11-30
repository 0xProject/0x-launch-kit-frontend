import { SignedOrder } from '0x.js';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FEE_RECIPIENT, INSTANT_FEE_PERCENTAGE, RELAYER_URL } from '../../../common/constants';
import { getUserIEOSignedOrders } from '../../../services/relayer';
import { getKnownTokens } from '../../../util/known_tokens';
import { getKnownTokensIEO } from '../../../util/known_tokens_ieo';
import { Token, TokenIEO, Wallet } from '../../../util/types';
import { PageLoading } from '../../common/page_loading';

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
    const [isError, setError] = useState(false);
    const [text, setText] = useState('Loading ...');
    const query = useQuery();
    useEffect(() => {
        load0xInstantScript(() => {
            setScripReady(true);
        });
    }, []);

    const { networkId = 1 } = props;
    let feePercentage = INSTANT_FEE_PERCENTAGE;
    let orderSource: string | SignedOrder[] | undefined = RELAYER_URL;

    const openZeroXinstantModal = async () => {
        let token: Token | undefined;
        const tokenName = query.get('token');
        const tokenSymbol = query.get('symbol');
        const isEIO = query.get('isEIO');
        const isBot = query.get('isBot');
        // TODO refactor this to be better
        try {
            const knownTokens = getKnownTokens();
            const knownTokensIEO = getKnownTokensIEO();
            if (tokenName) {
                isBot
                    ? (token = knownTokensIEO.getTokenBotByName(tokenName))
                    : (token = knownTokens.getTokenByName(tokenName));
            }
            if (tokenSymbol) {
                isBot
                    ? (token = knownTokensIEO.getTokenBotBySymbol(tokenSymbol))
                    : (token = knownTokens.getTokenBySymbol(tokenSymbol));
            }
            if (token) {
                const isTokenIEO = knownTokens.isIEOKnownAddress(token.address);
                if (isTokenIEO) {
                    orderSource = undefined;
                }
                if (isBot) {
                    orderSource = undefined;
                }
            }

            if (isEIO && token) {
                const baseToken = token as TokenIEO;
                const wethToken = knownTokens.getWethToken();

                orderSource = await getUserIEOSignedOrders(baseToken.owners[0].toLowerCase(), baseToken, wethToken);

                if (!orderSource || orderSource.length === 0) {
                    orderSource = undefined;
                }
                feePercentage = Number(baseToken.feePercentage);
            } else if (isBot && token) {
                const baseToken = token as TokenIEO;
                const wethToken = knownTokens.getWethToken();
                const owners = baseToken.owners;

                // iterate to found orders by whitelist address order
                // TODO: create endpoint to retrieve orders ordered by address
                for (const owner of owners) {
                    orderSource = (await getUserIEOSignedOrders(
                        owner.toLowerCase(),
                        baseToken,
                        wethToken,
                    )) as SignedOrder[];
                    if (orderSource && orderSource.length > 0) {
                        break;
                    }
                }
                if (!orderSource || orderSource.length === 0) {
                    orderSource = undefined;
                }
                feePercentage = Number(baseToken.feePercentage);
            }
        } catch (e) {
            token = undefined;
            orderSource = undefined;
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
        if (orderSource) {
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
        } else {
            setText('ERROR! No orders for this Asset. Please Reload the page');
            setError(true);
        }
    };
    if (isScriptReady && !isError) {
        // tslint:disable-next-line: no-floating-promises
        openZeroXinstantModal();
    }
    return <PageLoading text={text} />;
};
