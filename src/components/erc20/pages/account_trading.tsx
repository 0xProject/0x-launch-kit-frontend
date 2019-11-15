import React from 'react';
import styled from 'styled-components';

import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { AccountTradingsContainer } from '../marketplace/account_tradings';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;

    &:last-child {
        margin-left: 0;
    }
`;

const AccountTradingsPage = () => (
    <Content>
        <ColumnWideMyWallet>
            <AccountTradingsContainer />
        </ColumnWideMyWallet>
        <FiatOnRampModalContainer />
    </Content>
);

export { AccountTradingsPage as default };
