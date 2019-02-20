import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../util/theme';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MainContentWrapper = styled.div`
    flex-grow: 0;
    flex-shrink: 1;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-grow: 1;
    }
`;

export const MainContent: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <MainContentWrapper {...restProps}>{children}</MainContentWrapper>;
};
