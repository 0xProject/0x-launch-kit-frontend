import React from 'react';
import { useLocation } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';

import { COINDIRECT_MERCHANT_ID, WYRE_ID } from '../../../common/constants';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { isMobile } from '../../../util/screen';
import { useWindowSize } from '../../common/hooks/window_size_hook';

interface Props {
    theme: Theme;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    margin: auto;
    overflow: auto;
    width: 100%;
    height: 100%;
    background-color: #2e4d7b;
    @media (max-width: ${themeBreakPoints.sm}) {
        width: inherit;
    }
`;

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const FiatOnRampModal = (props: Props) => {
    const query = useQuery();
    const ethAccount = query.get('account');
    const fiatType = query.get('fiat-type') || 'apple-pay';
    const coin = query.get('coin');
    const size = useWindowSize();
    let fiat_link;
    let coinType;
    const frame_width = isMobile(size.width) ? `${size.width - 10}` : '500';
    switch (fiatType) {
        case 'apple-pay':
            switch (coin) {
                case 'eth':
                    coinType = 'ETH';
                    break;
                case 'btc':
                    coinType = 'BTC';
                    break;
                default:
                    coinType = 'ETH';
                    break;
            }
            fiat_link = `https://pay.sendwyre.com/purchase?destCurrency=${coinType}&&dest=${ethAccount}&
            paymentMethod=apple-pay&accountId=${WYRE_ID}`;
            break;
        case 'credit-card':
            switch (coin) {
                case 'eth':
                    coinType = 'eth';
                    break;
                case 'btc':
                    coinType = 'btc';
                    break;
                default:
                    coinType = 'eth';
                    break;
            }
            fiat_link = `https://business.coindirect.com/buy?merchantId=${COINDIRECT_MERCHANT_ID}&to=${coinType}&address=${ethAccount}`;
            break;

        default:
            break;
    }
    return (
        <ModalContent>
            <iframe
                title="fiat_on_ramp"
                src={fiat_link}
                width={frame_width}
                height="810"
                frameBorder="0"
                allowFullScreen={true}
            />
        </ModalContent>
    );
};

export const FiatOnRampModalContainer = withTheme(FiatOnRampModal);
