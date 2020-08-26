import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../../account';
import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { Column, ColumnsWrapper } from '../../common/column';
import { Content } from '../common/content_wrapper';

export const MyWallet = () => (
    <Content>
        <CheckMetamaskStateModalContainer>
            <ColumnsWrapper>
                <Column>
                    <WalletWethBalanceContainer />
                </Column>
                <Column isWide={true}>
                    <WalletTokenBalancesContainer />
                </Column>
            </ColumnsWrapper>
        </CheckMetamaskStateModalContainer>
    </Content>
);
