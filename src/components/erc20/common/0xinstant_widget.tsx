import React from 'react';
import styled from 'styled-components';

import { FEE_RECIPIENT, INSTANT_FEE_PERCENTAGE } from '../../../common/constants';
import { getKnownTokens } from '../../../util/known_tokens';
import { ButtonVariant, Wallet } from '../../../util/types';
import { Button } from '../../common/button';

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

interface State {
    scriptReady: boolean;
}

interface Props {
    orderSource: string;
    tokenAddress: string;
    provider?: string;
    walletDisplayName?: Wallet | null;
    availableAssetDatas?: any;
    defaultSelectedAssetData?: any;
    defaultAssetBuyAmount?: any;
    additionalAssetMetaDataMap?: any;
    networkId?: number;
    affiliateInfo?: any;
    shouldDisableAnalyticsTracking?: boolean;
    onSuccess?: any;
    onClose?: any;
}

const BuyButton = styled(Button)`
    margin-left: 5px;
`;

declare var zeroExInstant: any;

export class ZeroXInstantWidget extends React.Component<Props, State> {
    public readonly state: State = {
        scriptReady: false,
    };

    public componentDidMount = () => {
        load0xInstantScript(() => {
            this.setState({ scriptReady: true });
        });
    };

    public render = () => {
        const { orderSource, networkId = 1, tokenAddress, walletDisplayName = Wallet.Metamask } = this.props;

        const openZeroXinstantModal = () => {
            const knownTokens = getKnownTokens();
            const token = knownTokens.getTokenByAddress(tokenAddress);
            const erc20TokenAssetData = zeroExInstant.assetDataForERC20TokenAddress(token.address);
            const additionalAssetMetaDataMap = {
                [erc20TokenAssetData]: {
                    assetProxyId: zeroExInstant.ERC20_PROXY_ID,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    name: token.name,
                    primaryColor: token.primaryColor,
                    iconUrl: token.icon,
                },
            };

            zeroExInstant.render(
                {
                    orderSource,
                    networkId,
                    affiliateInfo: {
                        feeRecipient: FEE_RECIPIENT,
                        feePercentage: INSTANT_FEE_PERCENTAGE,
                    },
                    walletDisplayName,
                    additionalAssetMetaDataMap,
                    defaultSelectedAssetData: erc20TokenAssetData,
                },
                'body',
            );
        };

        return (
            <>
                {this.state.scriptReady ? (
                    <BuyButton onClick={openZeroXinstantModal} variant={ButtonVariant.Buy}>
                        Buy
                    </BuyButton>
                ) : (
                    ''
                )}
            </>
        );
    };
}
