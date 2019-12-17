import React from 'react';
import styled from 'styled-components';

import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { WizardFormWithTheme } from '../marketplace/wizard_form';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;

    &:last-child {
        margin-left: 0;
    }
`;

const WizardPage = () => (
    <Content>
        <ColumnWideMyWallet>
            <WizardFormWithTheme />
        </ColumnWideMyWallet>
    </Content>
);

export { WizardPage as default };
