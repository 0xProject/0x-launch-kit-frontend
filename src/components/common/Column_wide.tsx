import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../util/theme';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ColumnWideWrapper = styled.div`
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 0;
    margin-left: 5px;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-grow: 1;
    }
`;

export const ColumnWide: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <ColumnWideWrapper {...restProps}>{children}</ColumnWideWrapper>;
};
