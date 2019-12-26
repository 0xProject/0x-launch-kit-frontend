import React from 'react';
import styled from 'styled-components';

import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { IEOTokenBalancesContainer } from '../ieo_desk/ieo_token_balances';
import { IEOWalletEthBalanceContainer } from '../ieo_desk/ieo_wallet_eth_balance';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;
    &:last-child {
        margin-left: 0;
    }
`;

const IEOPage = () => (
    <Content>
        <CheckWalletStateModalContainer>
            <ColumnWideMyWallet>
                <IEOTokenBalancesContainer />
                <IEOWalletEthBalanceContainer />
            </ColumnWideMyWallet>
        </CheckWalletStateModalContainer>
        <FiatOnRampModalContainer />
    </Content>
);

export { IEOPage as default };
