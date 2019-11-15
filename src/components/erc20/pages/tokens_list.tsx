import React from 'react';
import styled from 'styled-components';

import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { TokenListWithTheme } from '../marketplace/tokens_list';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;

    &:last-child {
        margin-left: 0;
    }
`;

const TokensListPage = () => (
    <Content>
        <ColumnWideMyWallet>
            <TokenListWithTheme />
        </ColumnWideMyWallet>
    </Content>
);

export { TokensListPage as default };
