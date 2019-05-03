import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ColumnMyCollectiblesWrapper = styled.div`
    flex-shrink: 0;
    max-width: 100%;
    width: 100%;

    @media (min-width: ${themeBreakPoints.xl}) {
        min-width: 256px;
        width: 256px;
        margin-right: 6px;
        margin-left: 6px;
    }
`;

export const ColumnMyCollectibles: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <ColumnMyCollectiblesWrapper {...restProps}>{children}</ColumnMyCollectiblesWrapper>;
};
