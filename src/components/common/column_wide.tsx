import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../themes/theme_commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ColumnWideWrapper = styled.div`
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 0;
    margin-left: 10px;
    @media (min-width: ${themeBreakPoints.xl}) {
        flex-grow: 1;
    }
`;

export const ColumnWide: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <ColumnWideWrapper {...restProps}>{children}</ColumnWideWrapper>;
};
