import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Centered = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0 auto;
    max-width: 100%;
    width: ${themeBreakPoints.xxl};
`;

export const CenteredWrapper: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <Centered {...restProps}>{children}</Centered>;
};
