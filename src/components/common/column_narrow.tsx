import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ColumnNarrowWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    max-width: 100%;
    width: 100%;

    @media (min-width: ${themeBreakPoints.xl}) {
        min-width: ${props => props.theme.dimensions.sidebarWidth};
        width: ${props => props.theme.dimensions.sidebarWidth};
    }

    &:first-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-right: 10px;
        }
    }

    &:last-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-left: 10px;
        }
    }
`;

export const ColumnNarrow: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <ColumnNarrowWrapper {...restProps}>{children}</ColumnNarrowWrapper>;
};
