import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ColumnWideWrapper = styled.div`
    flex-grow: 0;
    flex-shrink: 1;
    max-width: 100%;
    min-width: 0;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-grow: 1;
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

export const ColumnWide: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <ColumnWideWrapper {...restProps}>{children}</ColumnWideWrapper>;
};
